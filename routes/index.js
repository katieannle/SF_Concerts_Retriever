var express = require('express'),
    router  = express.Router(),
    request = require('request'),
    cheerio = require('cheerio'),
    async   = require('async');
    helpers = require('../helpers/dateHelper');
    utils   = require('../helpers/utils');


router.get('/', function(req, res){

    var base_url         = 'http://www.songkick.com', // Main web page to scrape
        urls             = [],                        // Holds all URLs to scrape (since concerts span multiple pages)
        concertDates     = {},                        // Holds concerts for the next 3 weekends
        daysToAdd        = utils.getDaysToAdd(),      // Gets the number of days to add to current day to get the next Friday or Saturday
        numWeekendsCount = 0,                         // Keeps track of how many weekends to look up (in this case 3)
        friday, saturday, sunday, dateRangeURL;

    if(daysToAdd === -1) { // case where today is already saturday, then you only need dates for saturday and sunday
      saturday     = new Date().addDays(daysToAdd + 1);
      sunday       = new Date().addDays(daysToAdd + 2);
      dateRangeURL = utils.createURL(saturday, sunday);
    } else if (daysToAdd >= 0) {
      friday       = new Date().addDays(daysToAdd);
      saturday     = new Date().addDays(daysToAdd + 1);
      sunday       = new Date().addDays(daysToAdd + 2);
      dateRangeURL = utils.createURL(friday, sunday);
    }

    urls.push(dateRangeURL); // Get the URL for concerts this upcoming weekend

    async.whilst(
        function() { return urls.length > 0; },
        function(callback) {
          request(urls[0], function(error, response, html) {
            if (error) {
              callback(error);
            }

            // Create a new weekend date if it does not already exist
            if(typeof(friday) !== 'undefined') {
              utils.addConcertDate(concertDates, friday);
            }
            utils.addConcertDate(concertDates, saturday);
            utils.addConcertDate(concertDates, sunday);

            // Get the artist and location for each concert listing and add it to its corresponding date
            var $ = cheerio.load(html);
            $('#event-listings').find('li').each(function () {
              var date = ($(this).attr('title')),
                  artist = $(this).find('p.artists.summary').text().trim().replace(/(\n)/gm, ', '),
                  location = $(this).find('p.location').text().trim().replace(/\s+/g, ' ');
              if (typeof(friday) !== 'undefined' && date === friday.toString()) {
                utils.addConcertDetails(concertDates, friday, artist, location);
              } else if (date === saturday.toString()) {
                utils.addConcertDetails(concertDates, saturday, artist, location);
              } else if (date === sunday.toString()) {
                utils.addConcertDetails(concertDates, sunday, artist, location);
              }
            });

            // Add URLS to retrieve results that span multiple pages
            var a_href = $('.next_page').attr('href');
            if(typeof a_href !== 'undefined') {
              urls.push(base_url + a_href);
            }

            // Create URL for the next weekend if there are no more pages to scrape
            if($('.next_page.disabled').length > 0) {
              numWeekendsCount++;
              if(numWeekendsCount < 3) {
                saturday.getNextWeek();
                dateRangeURL = utils.createURL(friday.getNextWeek(), sunday.getNextWeek());
                urls.push(dateRangeURL);
              }
            }

            // Remove visited URLS
            urls.splice(0, 1);
            callback(error);
          });
        },
        function() {
          res.render('index',{ title:'SF Concerts Over Next 3 Weekends', concerts : concertDates});
        });
  });

module.exports = router;
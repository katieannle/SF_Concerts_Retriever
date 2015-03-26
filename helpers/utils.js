/**
 * Creates a URL to search for concerts between a date range.  We are looking for concerts on a weekend, so I create
 * a range between Friday and Sunday in the week
 * @param friday
 * @param sunday
 * @returns {string}
 */
var createURL = function (friday, sunday) {
    return 'http://www.songkick.com/metro_areas/26330-us-sf-bay-area?utf8=%E2%9C%93&filters%5BminDate%5D=' + friday.getMonthPlus1() + '%2F' + friday.getDate() + '%2F' + friday.getFullYear() +
        '&filters%5BmaxDate%5D=' + sunday.getMonthPlus1() + '%2F' + sunday.getDate() + '%2F' + sunday.getFullYear() + '#date-filter-form';
};

/**
 * Gets the number of days that needs to be added to the current date in order to get the upcoming Friday.
 * If the current day is Saturday, then we return -1 and only look for concerts for Saturday and Sunday that week.
 * @returns {number}
 */
var getDaysToAdd = function () {
    var date      = new Date(),          // get today's date
        day       = date.getDay(),       // get the day of the week
        daysToAdd = 0;              // number of days to add to current day to get date of next Friday
    switch (day) {
        case 0 :                    // Sunday, get next weekend dates
            daysToAdd = 5;
            break;
        case 1 :
            daysToAdd = 4;
            break;
        case 2 :
            daysToAdd = 3;
            break;
        case 3 :
            daysToAdd = 2;
            break;
        case 4 :
            daysToAdd = 1;
            break;
        case 5 :                    // Friday, check friday, saturday, and sunday of this week
            daysToAdd = 0;
            break;
        case 6 :                    // Saturday, check saturday and sunday only of this week
            daysToAdd = -1;
            break;
    }
    return daysToAdd;
};

/**
 * Adds a concert date i.e. Friday 03 March 27 2015 to our list of concert dates
 * @param concertDates - list of weekend concert dates that we are keeping track of
 * @param date - date to be added
 */
var addConcertDate = function (concertDates, date) {
    if(!concertDates.hasOwnProperty(date.toString())) {
        concertDates[date.toString()] = [];
    }
};

/**
 * Adds concert details to the array of its corresponding concert date
 * @param concertDates - list of weekend concert dates that we are keeping track of
 * @param date - date that the concert details correspond to
 * @param artist - artist for the concert
 * @param location - location for the concert
 */
var addConcertDetails = function (concertDates, date, artist, location) {
    concertDates[date.toString()].push({'artist': artist, 'location': location});
};

module.exports = {
    getDaysToAdd        : getDaysToAdd,
    createURL           : createURL,
    addConcertDate      : addConcertDate,
    addConcertDetails   : addConcertDetails
};
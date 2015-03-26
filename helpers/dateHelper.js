var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Adds a certain amount of days to the current date
 * @param daysToAdd - amount of days you want to add to the current date
 * @returns {Date} - Date object that is 'daysToAdd' number of days from now
 */
Date.prototype.addDays = function (daysToAdd) {
    return new Date(this.setDate(this.getDate() + daysToAdd));
};

/**
 * Formats a date to 'Friday 03 March 27 2015'
 * @returns {string} - formatted string
 */
Date.prototype.toString = function () {
    return weekDays[this.getDay()] + ' ' + ('0' + this.getDate()).slice(-2) + ' ' + months[this.getMonth()] + ' ' + this.getFullYear();
};

/**
 * Gets the month of the current date and adds one to it for display purposes
 * i.e. if it is March, this function will return 3
 * @returns {number} - number that represents current month + 1
 */
Date.prototype.getMonthPlus1 = function () {
    return this.getMonth() + 1;
};

/**
 * Gets the date a week from now by adding 7 days to the current date
 * @returns {Date} - date object representing one week from today's date
 */
Date.prototype.getNextWeek = function () {
    return new Date(this.setDate(this.getDate() + 7));
};

module.exports = Date;

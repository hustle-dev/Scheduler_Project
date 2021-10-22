// helper function
const convertMonth = (() => {
  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];
  const monthNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return {
    toName(month) {
      return monthNames[month];
    },
    toNum(month) {
      return monthNums[month];
    }
  };
})();

/**
 * Returns an array based on date length and date object information and start date.
 * @param {number} length
 * @param {object} dateObj
 * @param {number} startDate
 * @return {Array} MonthDate
 */
const createMonthDate = (() => (length, dateObj, startDate) => {
  let date = startDate;
  return Array.from({ length }, () => ({ ...dateObj, date: date++ }));
})();

/**
 * Based on the current month, the date of the previous month
 * and the date of the next month are used to make a calendar.
 * @returns {Array} Calendar Date
 */
const createCalendarDate = (currentYear, currentMonth) => {
  const prevYear = currentYear - !currentMonth;
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const nextYear = currentYear + +(currentMonth === 11);
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const lengthOfNextMonth = 6 - new Date(currentYear, currentMonth + 1, 0).getDay();

  const dateOfPrevMonth = {
    year: prevYear,
    month: convertMonth.toNum(prevMonth),
    current: false
  };
  const dateOfThisMonth = {
    year: currentYear,
    month: convertMonth.toNum(currentMonth),
    current: true
  };
  const dateOfNextMonth = {
    year: nextYear,
    month: convertMonth.toNum(nextMonth),
    current: false
  };
  return [
    ...createMonthDate(firstDayOfMonth, dateOfPrevMonth, lastDateOfMonth - firstDayOfMonth),
    ...createMonthDate(lastDateOfMonth, dateOfThisMonth, 1),
    ...createMonthDate(lengthOfNextMonth, dateOfNextMonth, 1)
  ];
};

export { convertMonth, createCalendarDate };

// DOM Nodes
const $calendarDate = document.querySelector('.calendar-date');
const $popup = document.querySelector('.popup');
const $overlay = document.querySelector('.overlay');

// Variables ------------------------------
const selectedYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth();

// const userData = {
//   userName: 'jimmy',
//   // selectedDate: null,
//   todolist: [
//     { id: 3, content: '알고리즘', completed: true },
//     { id: 2, content: '지식창고', completed: false },
//     { id: 1, content: 'TS공부', completed: false }
//   ]
// };

// Functions------------------------------------------

const createMonthDate = (
  () => (length, obj, start) =>
    // eslint-disable-next-line no-param-reassign
    Array.from({ length }, () => ({ ...obj, date: start++ }))
)();

const render2 = () => {
  const convertToRegularMonth = (() => {
    const monthName = [
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
    const monthNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return {
      makeStr(month) {
        return monthName[month];
      },
      makeNum(month) {
        return monthNum[month];
      }
    };
  })();

  const prevYear = selectedYear - !selectedMonth;
  const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const lastDateMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const nextYear = selectedYear + +(selectedMonth === 11);
  const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
  const lengthOfNextMonth = 6 - new Date(selectedYear, selectedMonth + 1, 0).getDay();

  // 이거 활용할끄야
  // const getMonth = month => new Date(0, month).toLocaleString('en-us', { month: 'short' });
  const dateOfPrevMonth = {
    year: prevYear,
    month: convertToRegularMonth.makeNum(prevMonth),
    current: false
  };
  const dateOfThisMonth = {
    year: selectedYear,
    month: convertToRegularMonth.makeNum(selectedMonth),
    current: true
  };
  const dateOfNextMonth = {
    year: nextYear,
    month: convertToRegularMonth.makeNum(nextMonth),
    current: false
  };

  const mergeEachMonth = [
    ...createMonthDate(firstDayOfMonth, dateOfPrevMonth, lastDateMonth - firstDayOfMonth),
    ...createMonthDate(lastDateMonth, dateOfThisMonth, 1),
    ...createMonthDate(lengthOfNextMonth, dateOfNextMonth, 1)
  ];

  document.querySelector('.calendar-month').innerHTML = `${convertToRegularMonth.makeStr(
    selectedMonth
  )}<span>${selectedYear}</span>`;
  $calendarDate.innerHTML = mergeEachMonth
    .map(
      ({ year, month, date, current }) =>
        `<button class="${
          current ? '' : 'other-month'
        }"><time datetime="${year}-${month}-${date}">${date}</time></button>`
    )
    .join('');
};

// Event bindings --------------------------------------
window.addEventListener('DOMContentLoaded', render2);

// document.querySelector('.move-prev-months').onclick = () => {
//   if (selectedMonth === 0) {
//     selectedMonth = 11;
//     selectedYear -= 1;
//   } else selectedMonth -= 1;

//   render2();
// };

// document.querySelector('.move-next-months').onclick = () => {
//   if (selectedMonth === 11) {
//     selectedMonth = 0;
//     selectedYear += 1;
//   } else selectedMonth += 1;

//   render2();
// };

document.querySelector('.calendar').onclick = () => {
  // if (!e.target.matches('button')) return;
  if (Math.abs(11 - selectedMonth) === 0 || Math.abs(11 - selectedMonth) === 11) {
    selectedMonth = Math.abs(selectedMonth - 11);
  } else selectedMonth += 1;
  render2();
};

const displayPopup = () => {
  $popup.style.display = 'block';
  $overlay.style.display = 'block';
};

$calendarDate.onclick = () => {
  displayPopup();
};

$overlay.onclick = () => {
  $popup.style.display = 'none';
  $overlay.style.display = 'none';
};

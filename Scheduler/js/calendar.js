// DOM Nodes
const $calendar = document.querySelector('.calendar');

const convertToRealMonth = (() => {
  const monthStr = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAy',
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
      return monthStr[month];
    },
    makeNum(month) {
      return monthNum[month];
    }
  };
})();

// state

const userData = {
  userName: 'jimmy',
  // selectedDate: null,
  todolist: [
    { id: 3, content: '알고리즘', completed: true },
    { id: 2, content: '지식창고', completed: false },
    { id: 1, content: 'TS공부', completed: false }
  ]
};

// Functions

// date format 으로 바꾸기 (넘겨줄 데이터)
const calendarForamt = () => {
  const format = n => (n < 10 ? '0' + n : n + '');
  return date => `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
};

// date 채우기 (첫째날, 마지막날 구해서 date 배열 채우기)
const createMonthDate = (
  () => (length, obj, start) =>
    // eslint-disable-next-line no-param-reassign
    Array.from({ length }, () => ({ ...obj, date: start++ }))
)();

// selectedYear , selectedMonth -> 고치기
let [selectedYear, selectedMonth] = [new Date().getFullYear(), new Date().getMonth()];
// 이번달 정보
// const getLastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

// 저번달 정보
const prevYear = selectedYear - !selectedMonth;
const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
const getFirstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
const getLastDateMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

// 다음달 정보
const nextYear = selectedYear + +(selectedMonth === 11);
const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
const lengthOfNextMonth = 6 - new Date(selectedYear, selectedMonth + 1, 0).getDay();

// 이거 활용할끄야
// const getMonth = month => new Date(0, month).toLocaleString('en-us', { month: 'short' });
const dataOfPrevMonth = {
  year: prevYear,
  month: convertToRealMonth.makeNum(prevMonth),
  current: false
};
const dataOfThisMonth = {
  year: selectedYear,
  month: convertToRealMonth.makeNum(selectedMonth),
  current: true
};
const dataOfNextMonth = {
  year: nextYear,
  month: convertToRealMonth.makeNum(nextMonth),
  current: false
};

const mergeEachMonth = [
  ...createMonthDate(getFirstDayOfMonth, dataOfPrevMonth, getLastDateMonth - getFirstDayOfMonth),
  ...createMonthDate(getLastDateMonth, dataOfThisMonth, 1),
  ...createMonthDate(lengthOfNextMonth, dataOfNextMonth, 1)
];

const render2 = () => {
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

// prev-button 누르면 앞으로, next-buttons 누르면 다음으로 이동
$calendar.onclick = e => {
  if (!e.target.matches('button')) return;
  console.log(e.target);
  if (e.target.classList.contains('.move-next-months')) {
    [selectedYear, selectedMonth] = [new Date().getFullYear(), new Date().getMonth() + 1];
  }

  if (e.target.classList.contains('.move-next-months')) {
    console.log('v');
  }
};

import { userKey, userInfo } from './store.js';

console.log(userInfo.todolist['2021-10-19']);

// console.log(userKey === 'abc');

// console.log(Object.keys(JSON.parse(localStorage.getItem('user'))[userKey].todolist));
// console.log(JSON.parse(localStorage.getItem('user'))[userKey].todolist);

let todos = [];

// DOM Nodes
const $calendar = document.querySelector('.calendar');
const $calendarDate = document.querySelector('.calendar-date');

const $yearMonth = document.querySelector('.year-month');
const $newTodo = document.querySelector('.new-todo');
const $todoList = document.querySelector('.todo-list');

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

// const userData = {
//   userName: 'jimmy',
//   // selectedDate: null,
//   todolist: [
//     { id: 3, content: '알고리즘', completed: true },
//     { id: 2, content: '지식창고', completed: false },
//     { id: 1, content: 'TS공부', completed: false }
//   ]
// };

// const userData
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
const dateOfThisMonth = {
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
  ...createMonthDate(getLastDateMonth, dateOfThisMonth, 1),
  ...createMonthDate(lengthOfNextMonth, dataOfNextMonth, 1)
];

const render2 = () => {
  $calendarDate.innerHTML = mergeEachMonth
    .map(
      ({ year, month, date, current }) =>
        `<button class="${
          current ? '' : 'other-month'
        }"><time datetime="${year}-${month}-${date}">${date}<div class="todo"></div></time></button>`
    )
    .join('');

  $calendarDate.querySelectorAll('time').forEach(data => {
    if (Object.keys(userInfo.todolist).includes(data.dateTime)) {
      data.firstElementChild.innerHTML = `<div class="todo-item">${
        userInfo.todolist[data.dateTime][0].content
      }</div><div class="todo-item">${userInfo.todolist[data.dateTime][1].content}</div>`;
    }
  });
};

// Event bindings --------------------------------------
window.addEventListener('DOMContentLoaded', render2);

// prev-button 누르면 앞으로, next-buttons 누르면 다음으로 이동
$calendar.onclick = e => {
  if (!e.target.matches('button')) return;
  if (e.target.classList.contains('move-prev-months')) {
    [selectedYear, selectedMonth] = [new Date().getFullYear(), new Date().getMonth() - 1];
  }

  if (e.target.classList.contains('move-next-months')) {
    [selectedYear, selectedMonth] = [new Date().getFullYear(), new Date().getMonth() + 1];
  }
};

const $popup = document.querySelector('.popup');
const $overlay = document.querySelector('.overlay');

const displayPopup = () => {
  $popup.style.display = 'block';
  $overlay.style.display = 'block';
};

$overlay.onclick = () => {
  $popup.style.display = 'none';
  $overlay.style.display = 'none';
};

const render = date => {
  $todoList.innerHTML = todos
    .map(
      ({ id, content, completed }) => `
    <li data-id="${id}">
        <div class="view">
        <input type="checkbox" class="toggle" ${completed ? 'checked' : ''}/>
        <label>${content}</label>
        <button class="destroy"></button>
        </div>
    </li>`
    )
    .join('');
};

const setTodo = newTodo => {
  todos = newTodo;
  render();
};

$calendarDate.onclick = e => {
  const targetDateTime = e.target.closest('time').getAttribute('datetime');
  if (userInfo.todolist[`${targetDateTime}`]) {
    setTodo(userInfo.todolist[`${targetDateTime}`]);
  }
  $yearMonth.textContent = targetDateTime;

  displayPopup();
};

// ---------------------------------------------------------------------------------------------

const generateId = () => Math.max(...todos.map(todo => todo.id), 0) + 1;

const addTodo = content => {
  setTodo([{ id: generateId(), content, completed: false }, ...todos]);
};

const toggleTodoCompleted = id => {
  setTodo(todos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo)));
};

const removeTodo = id => {
  setTodo(todos.filter(todo => todo.id !== +id));
};

$newTodo.onkeyup = e => {
  if (e.key !== 'Enter' || e.target.value.trim() === '') return;

  addTodo(e.target.value);

  e.target.value = '';
};

$todoList.onchange = e => {
  if (!e.target.classList.contains('toggle')) return;

  toggleTodoCompleted(e.target.closest('li').dataset.id);
};

$todoList.onclick = e => {
  if (!e.target.classList.contains('destroy')) return;

  removeTodo(e.target.closest('li').dataset.id);
};

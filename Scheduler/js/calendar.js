const signupUserInfo = JSON.parse(localStorage.getItem('users'));

let userKey;
let todos = [];
let userInfo = {};
let allTodos = {};

// DOM Nodes

const $loginSuccessSign = document.querySelector('.login-success-sign');

const $yearMonth = document.querySelector('.year-month');
const $newTodo = document.querySelector('.new-todo');
const $todoList = document.querySelector('.todo-list');

const $logout = document.querySelector('.logout');

// ---------------------------------------------

const state = {
  year: new Date().getFullYear(),
  month: new Date().getMonth()
};

const $calendarDate = document.querySelector('.calendar-date');

const convertToRegularMonth = (() => {
  const monthStr = [
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
      return monthStr[month];
    },
    makeNum(month) {
      return monthNum[month];
    }
  };
})();

const createMonthDate = (
  () => (length, obj, start) =>
    Array.from({ length }, () => ({ ...obj, date: start++ }))
)();

const render2 = () => {
  const prevYear = state.year - !state.month;
  const prevMonth = state.month === 0 ? 11 : state.month - 1;
  const firstDayOfMonth = new Date(state.year, state.month, 1).getDay();
  const lastDateMonth = new Date(state.year, state.month + 1, 0).getDate();

  const nextYear = state.year + +(state.month === 11);
  const nextMonth = state.month === 11 ? 0 : state.month + 1;
  const lengthOfNextMonth = 6 - new Date(state.year, state.month + 1, 0).getDay();

  const dateOfPrevMonth = {
    year: prevYear,
    month: convertToRegularMonth.makeNum(prevMonth),
    current: false
  };
  const dateOfThisMonth = {
    year: state.year,
    month: convertToRegularMonth.makeNum(state.month),
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
    state.month
  )}<span>${state.year}</span>`;
  $calendarDate.innerHTML = mergeEachMonth
    .map(
      ({ year, month, date, current }) =>
        `<button class="${
          current ? '' : 'other-month'
        }"><time datetime="${year}-${month}-${date}">${date}<div class="todo"></div></time></time></button>`
    )
    .join('');

  $calendarDate.querySelectorAll('time').forEach(data => {
    if (Object.keys(allTodos).includes(data.dateTime)) {
      data.firstElementChild.innerHTML = `<div class="todo-item">${
        allTodos[data.dateTime][0].content
      }</div><div class="todo-item">${
        allTodos[data.dateTime].length >= 2 ? allTodos[data.dateTime][1].content : ''
      }</div>`;
    }
  });
};

document.querySelector('.move-prev-months').onclick = () => {
  if (state.month === 0) {
    state.month = 11;
    state.year -= 1;
  } else state.month -= 1;

  render2();
};

document.querySelector('.move-next-months').onclick = () => {
  if (state.month === 11) {
    state.month = 0;
    state.year += 1;
  } else state.month += 1;

  render2();
};

// Event bindings --------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  userKey = sessionStorage.getItem('userKey');
  allTodos = userInfo.todolist;

  $loginSuccessSign.textContent = `${userInfo.name}님 안녕하세요`;
  render2();
});

window.onbeforeunload = event => {
  event.preventDefault();

  localStorage.setItem(
    'users',
    JSON.stringify({
      ...signupUserInfo,
      [`${userKey}`]: { ...userInfo, todolist: { ...allTodos } }
    })
  );
  sessionStorage.setItem('userInfo', JSON.stringify({ ...userInfo, todolist: allTodos }));
  event.returnValue = '';
};

const $popup = document.querySelector('.popup');
const $overlay = document.querySelector('.overlay');

const displayPopup = () => {
  $popup.style.display = 'block';
  $overlay.style.display = 'block';
};

const updateAllTodos = () => {
  if (todos.length === 0) delete allTodos[`${document.querySelector('.year-month').textContent}`];
  if (todos.length !== 0) allTodos[`${document.querySelector('.year-month').textContent}`] = todos;
};

$overlay.onclick = () => {
  $popup.style.display = 'none';
  $overlay.style.display = 'none';

  updateAllTodos(todos);
  render2();
};

const render = () => {
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
  } else {
    setTodo([]);
  }
  $yearMonth.textContent = targetDateTime;

  displayPopup();
};

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

// ------------- logout -------------------

$logout.onclick = () => {
  localStorage.setItem(
    'users',
    JSON.stringify({
      ...signupUserInfo,
      [`${userKey}`]: { ...userInfo, todolist: { ...allTodos } }
    })
  );
  sessionStorage.setItem('userInfo', JSON.stringify({ ...userInfo, todolist: allTodos }));
  window.location.href = './';
};

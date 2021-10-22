import { convertMonth, createCalendarDate } from './helper.js';

let userKey = '';
let userInfo = {};
let userTodos = {};
let todayTodos = [];

let [currentYear, currentMonth] = [new Date().getFullYear(), new Date().getMonth()];

// DOM Node
const $logout = document.querySelector('.logout');
const $calendarDate = document.querySelector('.calendar-date');
const $popup = document.querySelector('.popup');
const $yearMonth = document.querySelector('.year-month');
const $newTodo = document.querySelector('.new-todo');
const $todoList = document.querySelector('.todo-list');
const $overlay = document.querySelector('.overlay');

/** render function */
const renderCalendar = () => {
  document.querySelector('.calendar-month').innerHTML = `
  ${convertMonth.toName(currentMonth)}
  <span>${currentYear}</span>`;

  $calendarDate.innerHTML = createCalendarDate(currentYear, currentMonth)
    .map(({ year, month, date, current }) => {
      const datetime = `${year}-${month}-${date}`;

      return `
      <button class="${current ? '' : 'other-month'}">
      <time datetime="${datetime}">${date}<div class="todo">
          ${
            userTodos[datetime]
              ? `<div class="todo-item">
                  ${userTodos[datetime][0].content}
                </div>
                <div class="todo-item">
                  ${userTodos[datetime][1] ? userTodos[datetime][1].content : ''}
                </div>`
              : ''
          }
        </div>
      </time>
      </button>`;
    })
    .join('');
};

const renderTodoList = () => {
  $todoList.innerHTML = todayTodos
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

/**
 * Replace newTodo with todayTodos and render.
 * @param {Array} newTodo
 */
const setTodo = newTodo => {
  todayTodos = newTodo;
  renderTodoList();
};

/**
 * generate id
 * @returns {number} ID
 */
const generateId = () => Math.max(...todayTodos.map(todo => todo.id), 0) + 1;

/**
 * replace content by new content
 * @param {string} content : new content;
 */
const addTodo = content => {
  setTodo([{ id: generateId(), content, completed: false }, ...todayTodos]);
};

/**
 * toggle todo completed by id
 * @param {string} id
 */
const toggleTodoCompleted = id => {
  setTodo(
    todayTodos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo))
  );
};

/**
 * remove todo by id
 * @param {string} id
 */
const removeTodo = id => {
  setTodo(todayTodos.filter(todo => todo.id !== +id));
};

/**
 * Determine display based on boolean value.
 * @param {boolean} bool
 */
const displayTodoList = bool => {
  $popup.style.display = bool ? 'initial' : 'none';
  $overlay.style.display = bool ? 'initial' : 'none';
};

/** update user todos */
const updateUserTodos = () => {
  todayTodos.length === 0
    ? delete userTodos[`${$yearMonth.textContent}`]
    : (userTodos[`${$yearMonth.textContent}`] = todayTodos);
};

// Event binding
window.addEventListener('DOMContentLoaded', () => {
  userKey = sessionStorage.getItem('userKey');
  userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  userTodos = userInfo.todolist;
  document.querySelector('.login-success-sign').textContent = `${userInfo.name}님 안녕하세요`;
  renderCalendar();
});

document.querySelector('.move-prev-months').onclick = () => {
  currentMonth === 0 && (currentYear -= 1);
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  renderCalendar();
};

document.querySelector('.move-next-months').onclick = () => {
  currentMonth === 11 && (currentYear += 1);
  currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;

  renderCalendar();
};

$overlay.onclick = () => {
  displayTodoList(false);
  updateUserTodos(todayTodos);
  renderCalendar();
};

$calendarDate.onclick = e => {
  const targetDateTime = e.target.closest('time').getAttribute('datetime');
  setTodo(userTodos[targetDateTime] || []);

  $yearMonth.textContent = targetDateTime;

  displayTodoList(true);
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

$logout.onclick = () => {
  window.location.replace('./');
};

window.addEventListener('beforeunload', e => {
  e.preventDefault();

  localStorage.setItem(
    'users',
    JSON.stringify({
      ...JSON.parse(localStorage.getItem('users')),
      [userKey]: { ...userInfo, todolist: { ...userTodos } }
    })
  );
  sessionStorage.setItem('userInfo', JSON.stringify({ ...userInfo, todolist: userTodos }));
  e.returnValue = '';
});

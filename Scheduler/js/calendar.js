const signupUserInfo = JSON.parse(localStorage.getItem('users'));

let userKey;
let todos = [];
let userInfo = {};
let allTodos = {};

// DOM Node
const $loginSuccessSign = document.querySelector('.login-success-sign');
const $yearMonth = document.querySelector('.year-month');
const $newTodo = document.querySelector('.new-todo');
const $todoList = document.querySelector('.todo-list');
const $logout = document.querySelector('.logout');

// ---------------------------------------------------------------------

const $calendarDate = document.querySelector('.calendar-date');

let [currentYear, currentMonth] = [new Date().getFullYear(), new Date().getMonth()];

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

const createMonthDate = (() => (length, dateObj, startDate) => {
  let date = startDate;
  return Array.from({ length }, () => ({ ...dateObj, date: date++ }));
})();

const createCalendarDate = () => {
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

const renderCalendar = () => {
  document.querySelector('.calendar-month').innerHTML = `
  ${convertMonth.toName(currentMonth)}
  <span>${currentYear}</span>`;

  $calendarDate.innerHTML = createCalendarDate()
    .map(({ year, month, date, current }) => {
      const datetime = `${year}-${month}-${date}`;

      return `
      <button class="${current ? '' : 'other-month'}">
      <time datetime="${datetime}">${date}<div class="todo">
          ${
            allTodos[datetime]
              ? `<div class="todo-item">
                  ${allTodos[datetime][0].content}
                </div>
                <div class="todo-item">
                  ${allTodos[datetime][1] ? allTodos[datetime][1].content : ''}
                </div>`
              : ''
          }
        </div>
      </time>
      </button>`;
    })
    .join('');
};

// Event bindings --------------------------------------

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

// ------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  userKey = sessionStorage.getItem('userKey');
  allTodos = userInfo.todolist;
  $loginSuccessSign.textContent = `${userInfo.name}님 안녕하세요`;
  renderCalendar();
});

window.addEventListener('beforeunload', event => {
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
});

// ---------------------------------------------------------------------------------------------

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
  renderCalendar();
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

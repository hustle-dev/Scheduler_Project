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

const displayTodoList = bool => {
  $popup.style.display = bool ? 'initial' : 'none';
  $overlay.style.display = bool ? 'initial' : 'none';
};

const updateUserTodos = () => {
  todayTodos.length === 0
    ? delete userTodos[`${$yearMonth.textContent}`]
    : (userTodos[`${$yearMonth.textContent}`] = todayTodos);
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

const setTodo = newTodo => {
  todayTodos = newTodo;
  renderTodoList();
};

const generateId = () => Math.max(...todayTodos.map(todo => todo.id), 0) + 1;

const addTodo = content => {
  setTodo([{ id: generateId(), content, completed: false }, ...todayTodos]);
};

const toggleTodoCompleted = id => {
  setTodo(
    todayTodos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo))
  );
};

const removeTodo = id => {
  setTodo(todayTodos.filter(todo => todo.id !== +id));
};

window.addEventListener('DOMContentLoaded', () => {
  userKey = sessionStorage.getItem('userKey');
  userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  userTodos = userInfo.todolist;
  document.querySelector('.login-success-sign').textContent = `${userInfo.name}님 안녕하세요`;
  renderCalendar();
});

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

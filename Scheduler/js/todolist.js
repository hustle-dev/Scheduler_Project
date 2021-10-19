let todos = [
  { id: 3, content: '알고리즘', completed: true },
  { id: 2, content: '지식창고', completed: false },
  { id: 1, content: 'TS공부', completed: false }
];

const $newTodo = document.querySelector('.new-todo');
const $todoList = document.querySelector('.todo-list');

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

const generateId = () => Math.max(...todos.map(todo => todo.id), 0) + 1;

const addTodo = content => {
  setTodo([{ id: generateId(), content, completed: false }, ...todos]);
};

const toggleTodoCompleted = id => {
  setTodo(todos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo)));
};

window.addEventListener('DOMContentLoaded', render);

$newTodo.onkeyup = e => {
  if (e.key !== 'Enter' || e.target.value === '') return;

  addTodo(e.target.value);

  e.target.value = '';
};

$todoList.onchange = e => {
  if (!e.target.classList.contains('toggle')) return;

  toggleTodoCompleted(e.target.closest('li').dataset.id);
};

$todoList.onclick = e => {
  if (!e.target.classList.contains('destroy')) return;

  console.log(e.target);
};

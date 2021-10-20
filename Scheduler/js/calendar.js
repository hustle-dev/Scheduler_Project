// DOM Nodes
const $calendar = document.querySelector('.calendar');

// state
const todayDate = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  dates: [],
  selectedDate: null
};

const userData = {
  userName: 'jimmy',2
  selectedDate: null,
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
  return date =>
    `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
};

// date 채우기 (첫째날, 마지막날 구해서 date 배열 채우기)
const createEachDateOfMonth = (() => (selectedYear, selectedMonth) => {
  const getFirstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const getLastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0).getDay();
  Array.from({length:getLastDayOfMonth + 1}, (_, idx) => {
    if (i).
  })
})();

const render = () => {
  const getMonth = month => new Date(0, month).toLocaleString('en-us', { month: 'long' });
};

// prev-button 누르면 앞으로, next-buttons 누르면 다음으로 이동
$calendar.onclick = e => {
  if(e.target.classList.contains('.move-prev-months')) {
    console.log('a');
  }
  if(e.target.classList.contains('.move-next-months')) {
    console.log('v');
  }
}
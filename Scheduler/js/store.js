const userKey = 'abc';

const userInfo = {
  name: 'home',
  todolist: {
    '2021-10-19': [
      { id: 3, content: '알고리즘', completed: true },
      { id: 2, content: '지식창고', completed: false },
      { id: 1, content: 'TS공부', completed: false }
    ],
    '2021-10-20': [
      { id: 3, content: '알고리즘', completed: true },
      { id: 2, content: '지식창고', completed: false },
      { id: 1, content: 'TS공부', completed: false }
    ]
  }
};

export { userKey, userInfo };

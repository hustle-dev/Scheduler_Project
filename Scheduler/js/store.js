let userKey = '';

const userInfo = {};

const getUserKey = () => userKey;

const setUserKey = loginUserKey => {
  userKey = loginUserKey;
};

const getUserInfo = () => userInfo;

const setUserInfo = ({ name, todolist }) => {
  userInfo.name = name;
  userInfo.todolist = todolist;
};

export { getUserKey, setUserKey, getUserInfo, setUserInfo };

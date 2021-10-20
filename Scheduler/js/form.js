import { setUserKey, setUserInfo } from './store.js';
import { createToast, removeToast } from './toast.js';

// eslint-disable-next-line no-undef
const hashfunc = objectHash.sha1;

// state object
const VALID_PATTERNS = {
  userid: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
  password: /^[A-Za-z0-9]{6,12}$/,
  username: /.+/,
  confirm_password: /^$/
};

const ERROR_MESSAGES = {
  userid: '이메일 형식에 맞게 입력해주세요.',
  password: '영문 또는 숫자를 6~12자 입력하세요.',
  username: '이름을 입력해주세요.',
  confirm_password: '패스워드가 일치하지 않습니다.'
};

const validateAllsignin = {
  userid: false,
  password: false
};

const validateAllsignup = {
  userid: false,
  password: false,
  username: false,
  confirm_password: false
};

// DOM Nodes
const $signinForm = document.querySelector('.form.signin');
const $signupForm = document.querySelector('.form.signup');
const [$signupLink, $signinLink] = document.querySelectorAll('.link > a');

const toggleValidIcon = ($icon, bool) => {
  $icon.classList.toggle('hidden', bool);
};

const isAllValidate = checkValidObj => Object.values(checkValidObj).every(el => el);

const ActiveSubmit = ($submitButton, isAllValidate) => {
  $submitButton.toggleAttribute('disabled', !isAllValidate);
};
// const ActiveSubmit = ($submitButton, checkValidObj) => {
//   $submitButton.toggleAttribute('disabled', !Object.values(checkValidObj).every(el => el));
// };

const makeErrorMessage = (value, prop) =>
  VALID_PATTERNS[prop].test(value) ? '' : ERROR_MESSAGES[prop];

/**
 * 실시간 확인 하는 부분 더러우니 수정!
 */

const liveCheckConfirmPassword = (() => {
  const $container = document.getElementById('confirmPasswordContainer');
  const [$successIcon, $failIcon] = $container.querySelectorAll('.icon');
  const $input = $container.querySelector('input');
  const $errorMessage = $container.querySelector('.error-message');

  return value => {
    VALID_PATTERNS.confirm_password = new RegExp(`^${value}$`);
    if ($input.value === '') return;

    $errorMessage.textContent = makeErrorMessage($input.value, 'confirm_password');

    const isValidConfirmPassword = VALID_PATTERNS.confirm_password.test($input.value);
    toggleValidIcon($successIcon, !isValidConfirmPassword);
    toggleValidIcon($failIcon, isValidConfirmPassword);
  };
})();

const toggleLink = () => {
  [$signinForm, $signupForm].forEach($form => $form.classList.toggle('hidden'));
};

// 회원가입 userid 갱신
const writeUserid = userid => {
  document.getElementById('signup-userid').value = userid;
};

const autoWriteUseridinSignupFrom = (e, userid) => {
  document.getElementById('signup-userid').value = userid;
  if (!e.target.classList.contains('toast-link')) return;
  toggleLink();
  writeUserid(userid);
};

// const signupAction = (e, checkValidObj) => {};

// Event handler
const validCheckAction = ($target, checkValidObj) => {
  const prop = $target.getAttribute('name');
  const { parentNode: $inputContainer, value } = $target;
  const [$successIcon, $failIcon] = $inputContainer.querySelectorAll('.icon');

  // active submit
  const isValid = VALID_PATTERNS[prop].test(value);
  toggleValidIcon($successIcon, !isValid);
  toggleValidIcon($failIcon, isValid);

  checkValidObj[prop] = isValid;

  $inputContainer.querySelector('.error-message').textContent = makeErrorMessage(value, prop);
};

/**
 * Event binding
 * @todo throttle
 */
window.addEventListener('load', () => {
  [...document.querySelectorAll('.input-container input + label')].forEach($label =>
    $label.classList.add('addtransition')
  );
});

$signinForm.oninput = e => {
  validCheckAction(e.target, validateAllsignin);
  ActiveSubmit(e.currentTarget.querySelector('.button'), isAllValidate(validateAllsignin));
};

$signupForm.oninput = e => {
  console.log($signupForm);
  console.log(e.target);
  validCheckAction(e.target, validateAllsignup);
  if (e.target.getAttribute('name') === 'password') liveCheckConfirmPassword(e.target.value);

  ActiveSubmit(e.currentTarget.querySelector('.button'), isAllValidate(validateAllsignup));
};

$signinForm.onsubmit = e => {
  e.preventDefault();

  const [{ value: userid }, { value: password }] = e.currentTarget.querySelectorAll('input');

  // console.log(JSON.parse(localStorage.getItem('users'))[hashfunc({ userid, password })]);
  const userObj = JSON.parse(localStorage.getItem('users'));
  const userKey = hashfunc({ userid, password });

  // 로그인 성공
  if (userObj[userKey]) {
    setUserKey(hashfunc({ userid, password }));
    setUserInfo(userObj[userKey]);
    // 링크 이동
  } else {
    // 로그인 실패
    createToast(userid);
    document.querySelector('.toast').onclick = e => autoWriteUseridinSignupFrom(e, userid);
    removeToast();
  }

  // 데이터 옮겨주고 url 이동
  window.location.href = './calendar.html';
};

$signupForm.onsubmit = e => {
  e.preventDefault();
  const [{ value: userid }, { value: name }, { value: password }] =
    e.currentTarget.querySelectorAll('input');

  localStorage.setItem(
    'users',
    JSON.stringify({
      [hashfunc({ userid, password })]: {
        name,
        todolist: {}
      }
    })
  );
};

$signupLink.onclick = toggleLink;
$signinLink.onclick = toggleLink;

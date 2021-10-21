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

// 임시 DOM Nodes
const $signupUserid = document.getElementById('signup-userid');

const toggleValidIcon = ($icon, bool) => {
  $icon.classList.toggle('hidden', bool);
};

const isAllValidate = checkValidObj => Object.values(checkValidObj).every(el => el);

const ActiveSubmit = ($submitButton, isAllValidate) => {
  $submitButton.toggleAttribute('disabled', !isAllValidate);
};

const makeErrorMessage = (value, prop) =>
  VALID_PATTERNS[prop].test(value) ? '' : ERROR_MESSAGES[prop];

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
    validateAllsignup.confirm_password = isValidConfirmPassword;
  };
})();

const toggleLink = () => {
  [$signinForm, $signupForm].forEach($form => $form.classList.toggle('hidden'));
};

const autoWriteUseridinSignupFrom = (e, userid) => {
  if (!e.target.classList.contains('toast-link')) return;
  toggleLink();
  $signupUserid.value = userid;
};

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
  validCheckAction(e.target, validateAllsignup);
  if (e.target.getAttribute('name') === 'password') liveCheckConfirmPassword(e.target.value);

  ActiveSubmit(e.currentTarget.querySelector('.button'), isAllValidate(validateAllsignup));
};

const toastTitle = {
  signinFail: '존재하지 않는 회원입니다.',
  signupSuccess: '회원가입에 성공하셨습니다!'
};

const toastContent = {
  signinFail: `로 <a class="toast-link" href="javascript:void(0);">회원가입</a>을 진행하시겠습니까?`,
  signupSuccess: '로그인 해주세요!'
};

$signinForm.onsubmit = e => {
  e.preventDefault();

  const [{ value: userid }, { value: password }] = e.currentTarget.querySelectorAll('input');

  const userObj = JSON.parse(localStorage.getItem('users'));
  const userKey = hashfunc({ userid, password });

  // 로그인 성공
  if (userObj[userKey]) {
    sessionStorage.setItem('userKey', hashfunc({ userid, password }));
    sessionStorage.setItem('userInfo', JSON.stringify(userObj[userKey]));

    // 링크 이동
    $signinForm.querySelectorAll('input').forEach($input => {
      $input.value = '';
    });
    $signinForm.querySelectorAll('.icon').forEach($icon => $icon.classList.add('hidden'));

    window.location.href = './calendar.html';
  } else {
    // 로그인 실패
    createToast('fail', toastTitle.signinFail, userid + toastContent.signinFail);
    document.querySelector('.toast').onclick = e => {
      autoWriteUseridinSignupFrom(e, userid);
      validCheckAction($signupUserid, validateAllsignup);
    };
    removeToast();
  }
};

$signupForm.onsubmit = e => {
  e.preventDefault();
  const [{ value: userid }, { value: name }, { value: password }] =
    e.currentTarget.querySelectorAll('input');

  localStorage.setItem(
    'users',
    JSON.stringify({
      ...JSON.parse(localStorage.getItem('users')),
      [hashfunc({ userid, password })]: {
        name,
        todolist: {}
      }
    })
  );

  // toast창 띄우기
  createToast('success', toastTitle.signupSuccess, toastContent.signupSuccess);
  removeToast();

  // value값 초기화 후 sign in으로 이동
  document.querySelectorAll('input').forEach($input => {
    $input.value = '';
  });
  toggleLink();
  document.querySelectorAll('.icon').forEach($icon => $icon.classList.add('hidden'));
};

$signupLink.onclick = toggleLink;
$signinLink.onclick = toggleLink;

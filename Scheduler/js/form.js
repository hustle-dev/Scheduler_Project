import { createToast, removeToast } from './toast.js';

// get object-hash library
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

const signinValidation = {
  userid: false,
  password: false
};

const signupValidation = {
  userid: false,
  password: false,
  username: false,
  confirm_password: false
};

const toastTitle = {
  signinFail: '존재하지 않는 회원입니다.',
  signupSuccess: '회원가입에 성공하셨습니다!'
};

const toastContent = {
  signinFail: `로 <a class="toast-link" href="javascript:void(0);">회원가입</a>을 진행하시겠습니까?`,
  signupSuccess: '로그인 해주세요!'
};

// DOM Nodes
const $signinForm = document.querySelector('.form.signin');
const $signupForm = document.querySelector('.form.signup');
const [$signupLink, $signinLink] = document.querySelectorAll('.link > a');
const $signupUserid = document.getElementById('signup-userid');
const $signupConfirmPasswordInput = document.getElementById('signup-confirm-password');

// helper
const toggleValidIcon = ($icon, bool) => {
  $icon.classList.toggle('hidden', bool);
};

const isAllValid = verifyObj => Object.values(verifyObj).every(el => el);

const activeSubmitButton = ($submitButton, enable) => {
  $submitButton.toggleAttribute('disabled', !enable);
};

const createErrorMessage = (value, prop) =>
  VALID_PATTERNS[prop].test(value) ? '' : ERROR_MESSAGES[prop];

const switchForm = () => {
  [$signinForm, $signupForm].forEach($form => $form.classList.toggle('hidden'));
};

const autoFillUseridInSignupForm = ($target, userid) => {
  if (!$target.classList.contains('toast-link')) return;
  switchForm();
  $signupUserid.value = userid;
};

// Event handler
const notifyStatusByValidation = ($target, verifyObj) => {
  const prop = $target.getAttribute('name');
  const { parentNode: $targetContainer, value } = $target;
  const [$successIcon, $failIcon] = $targetContainer.querySelectorAll('.icon');

  const isValid = VALID_PATTERNS[prop].test(value);
  toggleValidIcon($successIcon, !isValid);
  toggleValidIcon($failIcon, isValid);

  verifyObj[prop] = isValid;

  $targetContainer.querySelector('.error-message').textContent = createErrorMessage(value, prop);
};

/**
 * Event binding
 * @todo throttle
 */

$signinForm.oninput = e => {
  notifyStatusByValidation(e.target, signinValidation);
  activeSubmitButton(e.currentTarget.querySelector('.button'), isAllValid(signinValidation));
};

$signupForm.oninput = e => {
  notifyStatusByValidation(e.target, signupValidation);
  if (e.target.getAttribute('name') === 'password') {
    VALID_PATTERNS.confirm_password = new RegExp(`^${e.target.value}$`);

    if ($signupConfirmPasswordInput.value === '') return;

    notifyStatusByValidation($signupConfirmPasswordInput, signupValidation);
  }

  activeSubmitButton(e.currentTarget.querySelector('.button'), isAllValid(signupValidation));
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

    window.location.replace('./calendar.html');
  } else {
    // 로그인 실패
    createToast('fail', toastTitle.signinFail, userid + toastContent.signinFail);

    document.querySelector('.toast').onclick = e => {
      autoFillUseridInSignupForm(e.target, userid);
      notifyStatusByValidation($signupUserid, signupValidation);
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
  document.querySelectorAll('.icon').forEach($icon => $icon.classList.add('hidden'));
  document.querySelectorAll('input').forEach($input => {
    $input.value = '';
  });
  switchForm();
};

$signupLink.onclick = switchForm;
$signinLink.onclick = switchForm;

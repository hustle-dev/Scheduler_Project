import {
  VALID_PATTERNS,
  ERROR_MESSAGES,
  signinValidation,
  signupValidation,
  toastTitle,
  toastContent
} from './state.js';
import { hashfunc, toggleValidIcon, isAllValid, activeSubmitButton } from './helper.js';
import { createToast, removeToast } from './toast.js';

// DOM Nodes
const $signinForm = document.querySelector('.form.signin');
const $signupForm = document.querySelector('.form.signup');
const [$signupLink, $signinLink] = document.querySelectorAll('.link > a');
const $signupUserid = document.getElementById('signup-userid');
const $signupConfirmPasswordInput = document.getElementById('signup-confirm-password');

// Event handler
const switchForm = () => {
  [$signinForm, $signupForm].forEach($form => $form.classList.toggle('hidden'));
};

/**
 * validation check and notification.
 * @param {Element} $target
 * @param {object} verifyObj
 */
const notifyStatusByValidation = ($target, verifyObj) => {
  const prop = $target.getAttribute('name');
  const { parentNode: $targetContainer, value } = $target;
  const [$successIcon, $failIcon] = $targetContainer.querySelectorAll('.icon');

  const isValid = VALID_PATTERNS[prop].test(value);
  toggleValidIcon($successIcon, !isValid);
  toggleValidIcon($failIcon, isValid);

  verifyObj[prop] = isValid;

  $targetContainer.querySelector('.error-message').textContent = VALID_PATTERNS[prop].test(value)
    ? ''
    : ERROR_MESSAGES[prop];
};

const trackConfirmPasswordValidation = $target => {
  if ($target.getAttribute('name') !== 'password') return;

  VALID_PATTERNS.confirm_password = new RegExp(`^${$target.value}$`);

  $signupConfirmPasswordInput.value &&
    notifyStatusByValidation($signupConfirmPasswordInput, signupValidation);
};

const setUserInfo = (userid, password, userInfo) => {
  sessionStorage.setItem('userKey', hashfunc({ userid, password }));
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

  window.location.replace('./calendar.html');
};

const guideSignupForm = userid => {
  createToast('fail', toastTitle.signinFail, userid + toastContent.signinFail);

  document.querySelector('.toast').onclick = e => {
    if (!e.target.classList.contains('toast-link')) return;
    $signupUserid.value = userid;
    switchForm();
    notifyStatusByValidation($signupUserid, signupValidation);
  };

  removeToast();
};

// Event binding
$signinForm.oninput = e => {
  notifyStatusByValidation(e.target, signinValidation);
  activeSubmitButton(e.currentTarget.querySelector('.button'), isAllValid(signinValidation));
};

$signupForm.oninput = e => {
  notifyStatusByValidation(e.target, signupValidation);
  trackConfirmPasswordValidation(e.target);
  activeSubmitButton(e.currentTarget.querySelector('.button'), isAllValid(signupValidation));
};

$signinForm.onsubmit = e => {
  e.preventDefault();

  const [{ value: userid }, { value: password }] = e.currentTarget.querySelectorAll('input');
  const userObj = JSON.parse(localStorage.getItem('users'));
  const userKey = hashfunc({ userid, password });

  userObj[userKey] ? setUserInfo(userid, password, userObj[userKey]) : guideSignupForm(userid);
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

  createToast('success', toastTitle.signupSuccess, toastContent.signupSuccess);
  removeToast();

  document.querySelectorAll('.icon').forEach($icon => $icon.classList.add('hidden'));
  document.querySelectorAll('input').forEach($input => {
    $input.value = '';
  });

  switchForm();
};

$signupLink.onclick = switchForm;
$signinLink.onclick = switchForm;

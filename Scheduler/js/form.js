// hash
const hash = objectHash.sha1;
// console.log(hash({ userid: 'sonwj0915@naver.com', password: '123456' }));

// state object
const VALID_PATTERNS = {
  userid: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
  password: /^[A-Za-z0-9]{6,12}$/,
  username: /.+/,
  confirm_password: /^$/
};

const $inputContainer = document.getElementById('confirmPasswordContainer');
const confirmPasswordObj = {
  $input: document.getElementById('signup-confirm-password'),
  $errorMessage: $inputContainer.querySelector('.error-message'),
  $icon: $inputContainer.querySelectorAll('.icon')
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

// helper
// const hashfunc =

const toggleValidIcon = ($icon, bool) => {
  $icon.classList.toggle('hidden', bool);
};

const toggleValidState = (checkValidObj, prop, bool) => {
  checkValidObj[prop] = bool;
};

const ActiveSubmit = ($submitButton, checkValidObj) => {
  $submitButton.toggleAttribute('disabled', !Object.values(checkValidObj).every(el => el));
};

const noticeError = (value, prop) => (VALID_PATTERNS[prop].test(value) ? '' : ERROR_MESSAGES[prop]);

const updateConfirmPasswordRegExp = value => {
  VALID_PATTERNS.confirm_password = new RegExp(`^${value}$`);
};

/**
 * 실시간 확인 하는 부분 더러우니 수정!
 */
const liveCheckConfirmPassword = value => {
  const [$confirmPasswordSuccessIcon, $confirmPasswordFailIcon] = confirmPasswordObj.$icon;
  const testConfirmPassword = VALID_PATTERNS.confirm_password.test(confirmPasswordObj.$input.value);

  updateConfirmPasswordRegExp(value);

  if (confirmPasswordObj.$input.value === '') return;

  confirmPasswordObj.$errorMessage.textContent = noticeError(
    confirmPasswordObj.$input.value,
    'confirm_password'
  );
  toggleValidIcon(
    $confirmPasswordSuccessIcon,
    !VALID_PATTERNS.confirm_password.test(confirmPasswordObj.$input.value)
  );
  toggleValidIcon(
    $confirmPasswordFailIcon,
    VALID_PATTERNS.confirm_password.test(confirmPasswordObj.$input.value)
  );
};

// Event handler
const validCheckAction = e => {
  const prop = e.target.getAttribute('name');
  const { parentNode: $inputContainer, value } = e.target;
  const [$successIcon, $failIcon] = $inputContainer.querySelectorAll('.icon');

  const isSignup = e.currentTarget.classList.contains('signup');

  const checkValidObj = isSignup ? validateAllsignup : validateAllsignin;

  if (prop === 'password' && isSignup) liveCheckConfirmPassword(value);

  // active submit
  toggleValidIcon($successIcon, !VALID_PATTERNS[prop].test(value));
  toggleValidIcon($failIcon, VALID_PATTERNS[prop].test(value));
  toggleValidState(checkValidObj, prop, VALID_PATTERNS[prop].test(value));
  ActiveSubmit(e.currentTarget.querySelector('.button'), checkValidObj);

  $inputContainer.querySelector('.error-message').textContent = noticeError(value, prop);
};

// hash function
// const hash = (id, password) => {};

/**
 * Event binding
 * @todo throttle
 */
window.addEventListener('load', () => {
  [...document.querySelectorAll('.input-container input + label')].forEach($label =>
    $label.classList.add('addtransition')
  );
});

$signinForm.oninput = validCheckAction;
$signupForm.oninput = validCheckAction;

$signinForm.onsubmit = e => {
  e.preventDefault();

  const [{ value: userid }, { value: password }] = e.currentTarget.querySelectorAll('input');

  if (!JSON.parse(localStorage.getItem('users'))[hash({ userid, password })]) return;

  // 로그인 성공

  // 데이터 옮겨주고 url 이동
};
$signupForm.onsubmit = e => {
  e.preventDefault();
  const [{ value: userid }, { value: name }, { value: password }, _] =
    e.currentTarget.querySelectorAll('input');

  localStorage.setItem(
    'users',
    JSON.stringify({
      [hash({ userid, password })]: {
        userid,
        password,
        name,
        todolist: []
      }
    })
  );
};

const toggleLink = () => {
  [$signinForm, $signupForm].forEach($form => $form.classList.toggle('hidden'));
};

$signupLink.onclick = toggleLink;
$signinLink.onclick = toggleLink;

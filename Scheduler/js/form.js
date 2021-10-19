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

/** @type {validateAllsignin} */
const validateAllsignin = {
  userid: false,
  password: false
};

/** @type {validateAllsignup} */
const validateAllsignup = {
  userid: false,
  password: false,
  username: false,
  confirm_password: false
};

// DOM Nodes
const $siginForm = document.querySelector('.form.signin');
const $signupForm = document.querySelector('.form.signup');

// helper
// const hashfunc =

const toggleValidIcon = ($icon, bool) => $icon.classList.toggle('hidden', bool);

const noticeError = (value, prop) => (VALID_PATTERNS[prop].test(value) ? '' : ERROR_MESSAGES[prop]);

const updateConfirmPasswordRegExp = value => {
  VALID_PATTERNS.confirm_password = new RegExp(`^${value}$`);
};

/**
 * 실시간 확인 하는 부분 더러우니 수정!
 */
const liveCheckConfirmPassword = value => {
  const [$confirmPasswordSuccessIcon, $confirmPasswordFailIcon] = confirmPasswordObj.$icon;

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

  if (prop === 'password' && isSignup) liveCheckConfirmPassword(value);

  toggleValidIcon($successIcon, !VALID_PATTERNS[prop].test(value));
  toggleValidIcon($failIcon, VALID_PATTERNS[prop].test(value));

  $inputContainer.querySelector('.error-message').textContent = noticeError(value, prop);
};

/**
 * Event binding
 * @todo throttle
 */
// $siginForm.oninput = validCheckAction;
// $signupForm.oninput = validCheckAction;
[$siginForm.oninput, $signupForm.oninput] = [validCheckAction, validCheckAction];

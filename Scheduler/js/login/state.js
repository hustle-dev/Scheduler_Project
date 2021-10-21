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

export {
  VALID_PATTERNS,
  ERROR_MESSAGES,
  signinValidation,
  signupValidation,
  toastTitle,
  toastContent
};

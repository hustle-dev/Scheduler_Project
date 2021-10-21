const createToast = userid => {
  const $toast = document.createElement('div');
  $toast.className = 'toast';
  $toast.innerHTML = `
        <h3 class="toast-heading">존재하지 않는 회원입니다.</h3>
          <div class="toast-message"> 
            <p>'${userid}'로 <a class="toast-link" href="javascript:void(0);">회원가입</a>을 진행하시겠습니까?</p>
          </div>
        <a class="toast-close">&times;</a>
  `;

  document.body.insertAdjacentElement('afterbegin', $toast);
};

const removeToast = () => {
  const $toast = document.querySelector('.toast');
  const removeTime = setTimeout(() => {
    document.body.removeChild($toast);
  }, 3000);

  document.querySelector('.toast-close').onclick = () => {
    document.body.removeChild($toast);
    clearTimeout(removeTime);
  };
};

export { createToast, removeToast };

const createToast = (type, title, content) => {
  const $toast = document.createElement('div');
  $toast.className = `toast ${type}`;
  $toast.innerHTML = `
        <h3 class="toast-heading">${title}</h3>
          <div class="toast-message"> 
            <p>${content}</p>
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

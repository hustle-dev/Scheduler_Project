// get object-hash library
const hashfunc = objectHash.sha1;

const toggleValidIcon = ($icon, bool) => {
  $icon.classList.toggle('hidden', bool);
};

const isAllValid = verifyObj => Object.values(verifyObj).every(el => el);

const activeSubmitButton = ($submitButton, enable) => {
  $submitButton.toggleAttribute('disabled', !enable);
};

export { hashfunc, toggleValidIcon, isAllValid, activeSubmitButton };

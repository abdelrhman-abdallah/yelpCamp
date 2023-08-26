const bsCustomeFileInput = require('./bs-custome-file-input.min');

(function () {
  'use strict';
  bsCustomeFileInput.init();
  const forms = document.querySelectorAll('.validated-form');

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      },
      false
    );
  });
})();

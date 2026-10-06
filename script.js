document.addEventListener('DOMContentLoaded', () => {

  /* MOBILE NAVIGATION */

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {

    toggle.addEventListener('click', () => {

      nav.classList.toggle('open');

      toggle.setAttribute(
        'aria-expanded',
        nav.classList.contains('open')
      );

    });


    nav.querySelectorAll('a').forEach(link => {

      link.addEventListener('click', () => {
        nav.classList.remove('open');

        toggle.setAttribute(
          'aria-expanded',
          'false'
        );
      });

    });

  }


  /* SCROLL REVEAL */

  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }

      });

    },
    {
      threshold:0.08
    }
  );


  document
    .querySelectorAll('.reveal')
    .forEach(element => {
      observer.observe(element);
    });


  /* CURRENT YEAR */

  document
    .querySelectorAll('[data-year]')
    .forEach(element => {
      element.textContent = new Date().getFullYear();
    });


  /* PRODUCT / ORDER FORM */

  const form = document.querySelector('[data-order-form]');

  if (form) {

    form.addEventListener('submit', event => {

      const action =
        form.getAttribute('action') || '';


      /*
       * Until a real Formspree ID is inserted,
       * the form automatically opens the user's
       * email client with the submitted information.
       */

      if (action.includes('YOUR_FORM_ID')) {

        event.preventDefault();

        const formData =
          new FormData(form);

        const subject =
          encodeURIComponent(
            'Azadipour — New Product / Order Request'
          );

        let body = '';

        for (const [key, value]
          of formData.entries()) {

          body += `${key}: ${value}\n`;

        }

        window.location.href =
          `mailto:herzchirurgsinaazadipour@gmail.com` +
          `?subject=${subject}` +
          `&body=${encodeURIComponent(body)}`;

      }

    });

  }

});

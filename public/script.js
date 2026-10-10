const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#quote-form');
const status = document.querySelector('#form-status');
const submit = document.querySelector('#submit-button');
const apiUrl = window.DFW_LIMO_API_URL || 'https://dfw-limo.luxtravco1.workers.dev/api/bookings';

function clearErrors() {
  form.querySelectorAll('.invalid').forEach((field) => field.classList.remove('invalid'));
  form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
}

function showErrors(fields = {}) {
  Object.entries(fields).forEach(([name, message]) => {
    const input = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    input?.closest('label')?.classList.add('invalid');
    if (error) error.textContent = message;
  });
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearErrors();
  status.className = 'form-status';
  status.textContent = '';
  submit.disabled = true;
  submit.setAttribute('aria-busy', 'true');

  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      showErrors(result.fields);
      throw new Error(result.error || 'We could not send your request. Please try again.');
    }
    status.className = 'form-status success show';
    status.textContent = 'Your booking request was received. DFW Limo will review your details and follow up with you.';
    form.reset();
  } catch (error) {
    status.className = 'form-status error show';
    status.textContent = error.message;
  } finally {
    submit.disabled = false;
    submit.removeAttribute('aria-busy');
  }
});

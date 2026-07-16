const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const sendAnotherBtn = document.getElementById('sendAnotherBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Send failed');

      contactForm.reset();
      contactForm.hidden = true;
      if (formSuccess) formSuccess.hidden = false;
    } catch (err) {
      alert('Something went wrong sending your message. Please try again, or email dieticianmeenu@gmail.com directly.');
    } finally {
      clearTimeout(timeout);
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

if (sendAnotherBtn) {
  sendAnotherBtn.addEventListener('click', () => {
    contactForm.hidden = false;
    formSuccess.hidden = true;
  });
}

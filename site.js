(() => {
  'use strict';
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const closeMenu = () => { navToggle.setAttribute('aria-expanded', 'false'); navLinks.dataset.open = 'false'; };
  navToggle.hidden = false;
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open)); navLinks.dataset.open = String(open);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); navToggle.focus(); } });
  document.documentElement.classList.add('js');
  const form = document.querySelector('[data-inquiry]');
  if (!form) return;
  const result = document.getElementById('brief-result'), area = document.getElementById('brief-text'), email = document.getElementById('email-brief'), status = document.getElementById('copy-status');
  const updateEmail = () => { email.href = 'mailto:josephjilovec@pm.me?subject=' + encodeURIComponent('Everstead Living — home planning interest') + '&body=' + encodeURIComponent(area.value); };
  const updateRoomList = () => {
    const selected = [...form.querySelectorAll('[name=rooms]:checked')].map(input => input.value);
    document.getElementById('room-list').textContent = selected.length ? selected.join(' · ') : 'Choose one room, or start with a general question.';
  };
  form.querySelectorAll('[name=rooms]').forEach(input => input.addEventListener('change', updateRoomList));
  document.querySelectorAll('[data-add-room]').forEach(link => link.addEventListener('click', () => {
    const check = form.querySelector('[data-room-check="' + link.dataset.addRoom + '"]');
    if (check) check.checked = true;
    updateRoomList(); result.hidden = true; status.textContent = '';
  }));
  form.addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(form);
    area.value = 'Everstead Living — home planning interest\n\n' +
      'Rooms or routines: ' + (data.getAll('rooms').join(', ') || 'General home-planning question') + '\n' +
      'Perspective: ' + data.get('perspective') + '\n' +
      'City or region: ' + (String(data.get('region') || '').trim() || 'To discuss') + '\n' +
      'Everyday routine: ' + (String(data.get('context') || '').trim() || 'To discuss') + '\n\n' +
      'I understand this service is in development. Please confirm availability and agree the scope before any engagement.';
    updateEmail(); result.hidden = false; document.getElementById('brief-heading').focus(); status.textContent = 'Draft created in this browser. Nothing has been sent.';
  });
  form.querySelector('[type=submit]').disabled = false;
  area.addEventListener('input', () => { updateEmail(); status.textContent = 'Your edits stay in the draft. Nothing has been sent.'; });
  form.addEventListener('input', event => { if (!event.target.closest('#brief-result')) { result.hidden = true; status.textContent = ''; } });
  document.getElementById('copy-brief').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(area.value); status.textContent = 'Copied. Paste the note into your preferred email app.'; }
    catch { area.focus(); area.select(); status.textContent = 'Select and copy the note using your device’s copy command.'; }
  });
  document.getElementById('download-brief').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([area.value], { type: 'text/plain;charset=utf-8' })), link = document.createElement('a');
    link.href = url; link.download = 'everstead-home-notes.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); status.textContent = 'Download prepared. The note has not been sent.';
  });
  updateRoomList();
})();

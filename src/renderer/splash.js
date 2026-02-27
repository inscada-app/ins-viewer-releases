// Read lang from query parameter (passed by main process)
const params = new URLSearchParams(window.location.search);
const lang = params.get('lang');
if (lang === 'en') {
  document.getElementById('splash-loading').textContent = 'Loading...';
}

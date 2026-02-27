// Hide logo on load error
const logo = document.getElementById('app-logo');
if (logo) {
  logo.addEventListener('error', () => { logo.style.display = 'none'; });
}

// Open links in external browser
document.querySelectorAll('a[href^="http"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.aboutAPI) {
      window.aboutAPI.openExternal(link.href);
    }
  });
});

// Get version and apply locale
if (window.aboutAPI) {
  window.aboutAPI.getVersion().then(v => {
    document.getElementById('version').textContent = 'v' + v;
  });

  window.aboutAPI.getLocaleStrings().then(strings => {
    document.getElementById('about-description').textContent = strings['about.description'];
    document.getElementById('link-docs').textContent = strings['about.docs'];
    document.getElementById('about-copyright').textContent = strings['about.copyright'];
  });
}

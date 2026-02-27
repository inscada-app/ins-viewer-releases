document.addEventListener('DOMContentLoaded', async () => {
  if (window.inscada) {
    try {
      const status = await window.inscada.getConnectionStatus();
      document.getElementById('target-url').textContent = status.url || '';
    } catch {
      // Preload might not be available
    }

    try {
      const strings = await window.inscada.getLocaleStrings();
      document.getElementById('connecting-title').textContent = strings['connecting.title'];
      document.getElementById('connecting-info').textContent = strings['connecting.info'];
    } catch {
      // Locale might not be available
    }
  }
});

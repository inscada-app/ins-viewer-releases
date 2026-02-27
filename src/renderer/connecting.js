document.addEventListener('DOMContentLoaded', async () => {
  if (window.inscada) {
    try {
      const status = await window.inscada.getConnectionStatus();
      document.getElementById('target-url').textContent = status.url || '';
    } catch {
      // Preload might not be available
    }
  }
});

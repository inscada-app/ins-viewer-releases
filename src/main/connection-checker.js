const http = require('http');
const https = require('https');

class ConnectionChecker {
  constructor(url, opts = {}) {
    this.url = url;
    this.interval = opts.interval || 3000;
    this.timeout = opts.timeout || 5000;
    this.online = false;
    this.timer = null;
    this.onStatusChange = opts.onStatusChange || (() => {});
  }

  setUrl(url) {
    this.url = url;
  }

  async check() {
    const wasOnline = this.online;
    this.online = await this._ping();
    if (this.online !== wasOnline) {
      this.onStatusChange(this.online);
    }
    return this.online;
  }

  start() {
    this.stop();
    // Initial check
    this.check();
    this.timer = setInterval(() => this.check(), this.interval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  _ping() {
    return new Promise((resolve) => {
      try {
        const parsedUrl = new URL(this.url);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          resolve(false);
          return;
        }
        const client = parsedUrl.protocol === 'https:' ? https : http;
        const req = client.request(
          {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
            method: 'HEAD',
            timeout: this.timeout,
          },
          (res) => {
            res.resume();
            resolve(true);
          }
        );
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
          req.destroy();
          resolve(false);
        });
        req.end();
      } catch {
        resolve(false);
      }
    });
  }
}

module.exports = ConnectionChecker;

let puppeteer = require("puppeteer");

module.exports = class Puppeteer {
  constructor() {
    this.browser = null;
    this.page = null;
    this.loaded = false;

    this.args = [
      "--autoplay-policy=user-gesture-required",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-dev-shm-usage",
      "--disable-domain-reliability",
      "--disable-extensions",
      "--disable-features=AudioServiceOutOfProcess",
      "--disable-hang-monitor",
      "--disable-ipc-flooding-protection",
      "--disable-notifications",
      "--disable-offer-store-unmasked-wallet-cards",
      "--disable-popup-blocking",
      "--disable-print-preview",
      "--disable-prompt-on-repost",
      "--disable-renderer-backgrounding",
      "--disable-setuid-sandbox",
      "--disable-speech-api",
      "--disable-sync",
      "--hide-scrollbars",
      "--ignore-gpu-blacklist",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-first-run",
      "--no-pings",
      "--no-sandbox",
      "--no-zygote",
      "--password-store=basic",
      "--use-gl=swiftshader",
      "--use-mock-keychain",
      "--disable-accelerated-2d-canvas",
      "--single-process",
      "--disable-gpu",
    ];

    this.initialize();
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      args: this.args,
      headless: true,
      ignoreHTTPSErrors: true,
    });
    this.page = await this.browser.newPage();

    await this.page.goto("https://moomoo.io", { timeout: 0 });
    await this.page.waitForNavigation({ waitUntil: "load" });

    this.loaded = true;

    this.browser.once("disconnected", () => {
      this.browser = null;
      this.page = null;
      this.loaded = false;

      this.initialize();
    });
  }

  generateToken() {
    return this.page.evaluate((loaded) => {
      return new Promise((resolve, reject) => {
        if (!loaded) {
          return reject("Browser isn't loaded.");
        }

        window.grecaptcha
        .execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", { action: "homepage" })
        .then((token) => resolve(window.encodeURIComponent(token)))
        .catch((error) => reject(error));
      });
    }, this.loaded);
  }
}
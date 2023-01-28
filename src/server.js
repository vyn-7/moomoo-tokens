let Puppeteer = require("./browser.js");
let server = require("express")();
let puppeteer = new Puppeteer();

server.get("/token", async (request, response) => {
  if (puppeteer.browser === null || puppeteer.page === null) return;

  puppeteer.generateToken()
  .then((resolve) => response.send(resolve));
});

server.get("/status", async (request, response) => {
  if (puppeteer.browser === null || puppeteer.page === null) {
    response.send("Browser didn't launch yet.");
  } else {
    if (puppeteer.loaded) response.send("Browser is loaded.");
    else response.send("Browser isn't loaded.");
  }
});

server.listen(3000);

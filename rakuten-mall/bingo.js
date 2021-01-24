const { chromium } = require("playwright");

const getJST = () => new Date().toLocaleString({ timeZone: "Asia/Tokyo" });

module.exports = async (mail, pass) => {
  console.log("bingo begin: ", getJST());

  const browser = await chromium.launch({ headless: false });
  // const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const isAdUrl = (url) => {
    url.href.startsWith("https://js.monetize-ssp.com") ||
      url.href.startsWith("https://j.microad.net") ||
      url.href.startsWith("https://j.microad.net") ||
      url.href.startsWith("https://j.microad.net") ||
      url.href.startsWith("https://www.googletagmanager.com/") ||
      url.href.startsWith("https://js-agent.newrelic.com/");
  };
  await page.route(isAdUrl, (route) => route.abort());

  await page.goto("https://pointmall.rakuten.co.jp/");
  await page
    .waitForSelector("id=header__login", {
      state: "attached",
      timeout: 5000,
    })
    .then(async () => {
      await page.click("id=header__login", { timeout: 5000 });
      await page.waitForSelector("id=loginInner_u", {
        state: "attached",
        timeout: 5000,
      });
      await page.fill("id=loginInner_u", mail);
      await page.fill("id=loginInner_p", pass);
      await page.click('input[type="submit"]');
    })
    .catch(() => console.log("already logged in"));

  await page
    .waitForSelector(".TOP-daily-btn", {
      state: "attached",
      timeout: 5000,
    })
    .then(async () => {
      await page.click(".TOP-daily-btn > a", { timeout: 5000 });
      await page.waitForTimeout(500);
      await page.click(".kuji__scene01__circle_dummy01", { timeout: 5000 });
      await page.waitForTimeout(7000);
    })
    .catch((e) => console.warn(e));

  await page
    .goto("https://pointmall.rakuten.co.jp/game/bingo/get_card")
    .then(async () => {
      await page
        .waitForSelector("#bingocard", {
          state: "attached",
          timeout: 5000,
        })
        .then(async () => {
          await page.click("#video-add-modal-skip-btn", { timeout: 5000 });
          await page.waitForTimeout(7000);
        });
    })
    .catch((e) => console.warn(e));

  await browser.close();

  console.log("bingo end: ", getJST());
};

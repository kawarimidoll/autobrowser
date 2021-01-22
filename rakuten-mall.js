require("dotenv").config();
const { chromium } = require("playwright");

const getJST = () => new Date().toLocaleString({ timeZone: "Asia/Tokyo" });

if (!process.env.RAKUTEN_MAIL || !process.env.RAKUTEN_PASS) {
  console.error("env values are missing.");
  process.exit(1);
}

(async () => {
  console.log("rakuten-mall begin: ", getJST());

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
      await page.fill("id=loginInner_u", process.env.RAKUTEN_MAIL);
      await page.fill("id=loginInner_p", process.env.RAKUTEN_PASS);
      await page.click('input[type="submit"]');
    })
    .catch(() => console.log("already logged in"));

  // await page
  //   .waitForSelector(".TOP-daily-btn", {
  //     state: "attached",
  //     timeout: 5000,
  //   })
  //   .then(async () => {
  //     await page.click(".TOP-daily-btn > a", { timeout: 5000 });
  //     await page.waitForTimeout(500);
  //     await page.click(".kuji__scene01__circle_dummy01", { timeout: 5000 });
  //     await page.waitForTimeout(7000);
  //   })
  //   .catch((e) => console.warn(e));

  // await page
  //   .goto("https://pointmall.rakuten.co.jp/game/quiz")
  //   .then(async () => {
  //     await page
  //       .waitForSelector(".lp-header-btn", {
  //         state: "attached",
  //         timeout: 5000,
  //       })
  //       .then(async () => {
  //         await page.click(".lp-header-btn", { timeout: 5000 });
  //         await page
  //           .waitForSelector(".btn-forward", {
  //             state: "attached",
  //             timeout: 5000,
  //           })
  //           .then(async () => {
  //             await page.click(".btn-forward", { timeout: 5000 });
  //             await page.waitForTimeout(7000);
  //           });
  //       });
  //   })
  //   .catch((e) => console.warn(e));

  // await page
  //   .goto("https://pointmall.rakuten.co.jp/game/bingo/get_card")
  //   .then(async () => {
  //     await page
  //       .waitForSelector("#bingocard", {
  //         state: "attached",
  //         timeout: 5000,
  //       })
  //       .then(async () => {
  //         await page.click("#video-add-modal-skip-btn", { timeout: 5000 });
  //         await page.waitForTimeout(7000);
  //       });
  //   })
  //   .catch((e) => console.warn(e));

  await page.route("**/*.{png,jpg,jpeg,gif,js}", (route) => route.abort());
  await page
    .goto("https://pointmall.rakuten.co.jp/game/bukubuku")
    .then(async () => {
      console.log("play bukubuku minigame");
      await page.waitForSelector(".lp-header-btn", {
        state: "attached",
        timeout: 5000,
      });
    })
    .then(async () => {
      await page.click(".lp-header-btn", { timeout: 5000 });
      await page.waitForTimeout(3000);

      for (let cnt = 0; cnt < 6; cnt += 1) {
        await page
          .goto("https://rakuten.dropgame.jp/minigame/play")
          .catch((e) => console.warn(e));
        for (let i = 1; i <= 9; i += 1) {
          await page
            .goto(`https://rakuten.dropgame.jp/minigame/select/${i}`)
            .catch((e) => console.warn(e));
          if (page.url() === "https://rakuten.dropgame.jp/minigame/result") {
            console.log("success!");
            break;
          }
        }
      }
    })
    .catch((e) => console.warn(e));

  await browser.close();

  console.log("rakuten-mall end: ", getJST());
})();

require("dotenv").config();
const { chromium } = require("playwright");

if (!process.env.COINGECKO_MAIL || !process.env.COINGECKO_PASS) {
  console.error("env values are missing.");
  process.exit(1);
}

// set false to debug
const headless = true;

(async () => {
  console.log("coingecko-candy start");
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("sign in to coingecko");
    await page.goto("https://www.coingecko.com/account/sign_in");
    await page.waitForSelector("id=user_email", {
      state: "attached",
      timeout: 5000,
    });

    await page.fill("id=user_email", process.env.COINGECKO_MAIL);
    await page.fill("id=user_password", process.env.COINGECKO_PASS);
    await page.click("id=user_remember_me");
    await page.click('input[type="submit"]');

    console.log("go to candy page");
    await page.goto("https://www.coingecko.com/account/candy?locale=ja");
    await page.waitForSelector("body", {
      state: "attached",
      timeout: 5000,
    });

    await page.click(".today-button >> nth=0", { timeout: 5000 });
    console.log("got candy");
  } catch (e) {
    console.warn(e);
  }

  await browser.close();
  console.log("coingecko-candy end");
})();

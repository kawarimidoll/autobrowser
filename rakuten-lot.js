require("dotenv").config();
const { chromium, devices } = require("playwright");

if (!process.env.RAKUTEN_MAIL || !process.env.RAKUTEN_PASS) {
  console.error("env values are missing.");
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const playLot = async (link, page) => {
    console.log(`play ${link}`);
    try {
      await page.goto(link);

      if (page.url() === "https://www.rakuten-card.co.jp/e-navi/index.xhtml") {
        await page.click("id=loginButton");
        await page.waitForSelector("id=loginInner_u", { state: "attached" });
      }
      if (/grp0\d\.id/.test(page.url())) {
        console.log("sign in...");
        await page
          .waitForSelector("id=loginInner_u", {
            state: "attached",
            timeout: 5000,
          })
          .then(async () => {
            await page.fill("id=loginInner_u", process.env.RAKUTEN_MAIL);
            await page.fill("id=loginInner_p", process.env.RAKUTEN_PASS);
            await page.click('input[type="submit"]');
          })
          .catch(async () => {
            await page.fill("id=username", process.env.RAKUTEN_MAIL);
            await page.fill("id=password", process.env.RAKUTEN_PASS);
            await page.click('button[type="submit"]');
          });
      }

      await page.waitForSelector("body", {
        state: "attached",
        timeout: 5000,
      });

      await page
        .click("id=entry", { timeout: 5000 })
        .then(async () => {
          console.log("wait... ");
          await page.waitForTimeout(16000);
          console.log("play finished");
        })
        .catch(() => {
          console.log("already played");
        });
    } catch (e) {
      console.warn(e);
    }
  };

  const linksInTable = async (table) => {
    const links = [];
    const aTags = await table.$$("a");
    for (let aTag of aTags) {
      const href = await aTag.getAttribute("href");
      links.push(href);
    }
    return links;
  };

  await page.goto("https://rakucoin.appspot.com/rakuten/kuji/");
  const tables = await page.$$("table");
  const pcLinks = await linksInTable(tables[0]);
  const spLinks = await linksInTable(tables[1]);

  for (let link of pcLinks) {
    await playLot(link, page);
  }

  const spContext = await browser.newContext({ ...devices["iPhone 11"] });
  const spPage = await spContext.newPage();
  for (let link of spLinks) {
    await playLot(link, spPage);
  }

  await browser.close();
})();

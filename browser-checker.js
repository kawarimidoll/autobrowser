// [Puppeteerの上位互換？自動テストにPlaywrightを使ってみる - Qiita](https://qiita.com/riku-shiru/items/fb3677780802ea90bd5e)
const playwright = require("playwright");

(async () => {
  for (const browserType of ["chromium", "firefox", "webkit"]) {
    // ここのbrowserTypeを変えることで、対象のブラウザを変更することができます。
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://yourbrowser.is/");
    await page.screenshot({ path: `output/browsertype-${browserType}.png` });
    await browser.close();
  }
})();

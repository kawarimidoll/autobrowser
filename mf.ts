import { Log, MF_PASSWORD, MF_USERNAME, puppeteer, sleep } from "./deps.ts";

export async function updateMoneyForward(
  { walletName, amount, debug = false, timeout = 10000, wait = 5 }: {
    walletName: string;
    amount: number;
    debug?: boolean;
    timeout?: number;
    wait?: number;
  },
) {
  if (!walletName || !amount) {
    throw new Error("walletName and amount cannot be blank");
  }
  const log = new Log({ minLogLevel: debug ? "debug" : "info" });

  log.debug("start");
  const browser = await puppeteer.launch({ headless: !debug });
  const page = await browser.newPage();

  log.debug("sign in");

  await page.goto("https://moneyforward.com/accounts");
  await page.waitForSelector(".buttonWrapper .ssoText", { timeout });
  await page.click(".buttonWrapper .ssoText");
  await page.waitForSelector(".blockContent .inputItem", { timeout });
  await page.type(".blockContent .inputItem", MF_USERNAME);
  await page.click(".blockContent .submitBtn");
  await page.waitForSelector(".blockContent .inputItem", { timeout });
  await page.type(".blockContent .inputItem", MF_PASSWORD);
  await page.click(".blockContent .submitBtn");

  await sleep(wait);

  log.debug("go to account page");

  await page.goto("https://moneyforward.com/accounts");
  await page.waitForSelector("#account-table", { timeout });
  await (await page.$x(`//a[text() = "${walletName}"]`)).at(0)?.click();

  await sleep(wait);

  log.debug("update balance");

  await page.waitForSelector("#accounts-show .heading-small .btn", { timeout });
  await page.click("#accounts-show .heading-small .btn");
  await sleep(wait);
  await page.waitForSelector("#rollover_info_value", { timeout });
  await page.type("#rollover_info_value", `${amount}`.replace(/\.\d+/, ""));
  await page.click("#rollover_info_transaction_flag");
  await page.click("#modal_rollover .btn");
  await sleep(wait);

  log.debug("sign out");
  await (await page.$x('//a[text() = "ログアウト"]')).at(0)?.click();

  await sleep(wait);

  await browser.close();
  log.debug("done");
}

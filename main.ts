import { Log } from "./deps.ts";
import { fetchTotalJpyInBinance } from "./ccxt.ts";
import { updateMoneyForward } from "./mf.ts";

const debug = false;
const log = new Log({ minLogLevel: debug ? "debug" : "info" });

log.info("get balances from Binance");
const { balances, totalJpy } = await fetchTotalJpyInBinance();
log.debug(balances);
log.info({ totalJpy });
if (Deno.args.includes("no-mf")) {
  Deno.exit(0);
}
log.info("apply balances to MoneyForward");
await updateMoneyForward({ walletName: "Binance", amount: totalJpy, debug });
log.info("done");

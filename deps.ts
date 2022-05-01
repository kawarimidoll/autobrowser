export { Log } from "https://deno.land/x/tl_log@0.1.1/mod.ts";
export {
  associateWith,
  distinct,
  filterKeys,
  filterValues,
  mapEntries,
} from "https://deno.land/std@0.136.0/collections/mod.ts";
export { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
export { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import ccxt from "https://esm.sh/ccxt";
export { ccxt, puppeteer };

import { config } from "https://deno.land/std@0.136.0/dotenv/mod.ts";
const { BINANCE_APIKEY, BINANCE_APISECRET, STAKED, MF_USERNAME, MF_PASSWORD } =
  await config();
export { BINANCE_APIKEY, BINANCE_APISECRET, MF_PASSWORD, MF_USERNAME, STAKED };

import {
  associateWith,
  BINANCE_APIKEY,
  BINANCE_APISECRET,
  ccxt,
  distinct,
  DOMParser,
  filterKeys,
  filterValues,
  mapEntries,
  STAKED,
} from "./deps.ts";

export async function getUsdJpyRate() {
  const src = await fetch(
    "https://diamond.jp/feature/forum/chart-detail?pair=USDJPY",
  );
  const html = await src.text();
  const dom = new DOMParser().parseFromString(html, "text/html")!;
  const rate =
    dom?.getElementsByClassName("table-val")?.at(0)?.getElementsByClassName(
      "large-val",
    )?.at(0)?.innerHTML || "129";
  return Number(rate);
}

export function getStakedAssetsFromEnv(): Record<string, number> {
  const amountFormat = "[A-Z]+:\\d+(\\.\\d+)?";
  const regexp = new RegExp(`^${amountFormat}(,${amountFormat})+\$`);
  if (!regexp.test(STAKED)) {
    return {};
  }
  return STAKED.split(",").reduce(
    (acc, crnt) => {
      const [k, v] = crnt.split(":");
      return { ...acc, [k]: Number(v) };
    },
    {},
  );
}

export async function fetchTotalJpyInBinance() {
  const stakedAssets = getStakedAssetsFromEnv();
  const binance = new ccxt.binance({
    apiKey: BINANCE_APIKEY,
    secret: BINANCE_APISECRET,
  });

  const { total }: { total: Record<string, number> } = await binance
    .fetchBalance();

  const rawOwnedAssets = filterValues(total, (balance) => !!balance);
  const ownedAssetNames = distinct(
    Object.keys(rawOwnedAssets).map((k) => k.replace(/^LD/, "")),
  ).sort();
  const ownedAssets = associateWith(
    ownedAssetNames,
    (key) =>
      (stakedAssets[key] || 0) + (rawOwnedAssets[key] || 0) +
      (rawOwnedAssets["LD" + key] || 0),
  );
  const tickers: Record<string, Record<string, number>> = await binance
    .fetchTickers();

  const filteredTickers = filterKeys(
    tickers,
    (key) => ownedAssetNames.includes(key.replace(/\/USDT$/, "")),
  );

  const tickerRates: Record<string, number> = {
    ...mapEntries(
      filteredTickers,
      ([name, { last }]) => [name.replace(/\/USDT$/, ""), last],
    ),
    "USDT": 1,
  };
  // console.log({ tickerRates });

  const usdJpyRate = await getUsdJpyRate();

  // console.log({usdJpyRate});

  const balances = ownedAssetNames.map((key) => {
    const amount = ownedAssets[key] || 0;
    const rate = tickerRates[key] || 1;
    const usd = amount * rate;
    const jpy = usd * usdJpyRate;
    return { symbol: key, amount, rate, usd, jpy };
  });
  const totalJpy = balances.reduce((acc, crnt) => acc + crnt.jpy, 0);
  return { balances, totalJpy };
}

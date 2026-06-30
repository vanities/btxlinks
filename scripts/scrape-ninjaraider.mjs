// scripts/scrape-ninjaraider.mjs
//
// ninjaraider publishes its pool stats only over a socket.io WebSocket (no REST
// API we could call server-side), so we render its dashboard in a headless
// browser, read the pool + network hashrate off the page, and emit the share as
// JSON on stdout. A GitHub Action runs this on a schedule and publishes the
// result to the `data` branch, which /api/pools then reads. All diagnostics go
// to stderr so stdout stays pure JSON.

import { chromium } from "playwright";

const URL = "https://ninjaraider.com/btx-pplns";
const UNIT = { "": 1, K: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15 };
const toHps = (n, u) => parseFloat(n) * (UNIT[(u || "").toUpperCase()] || 1);

const log = (...a) => process.stderr.write("[scrape] " + a.join(" ") + "\n");

const t0 = Date.now();
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const page = await browser.newPage({ userAgent: "btxlinks-ninjaraider-scraper/1.0 (+https://btxlinks.vercel.app)" });
  log("goto", URL);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });
  // Stats arrive over the websocket after load — wait until they render.
  await page
    .waitForFunction(() => /Network hashrate\s+[\d.]/i.test(document.body.innerText), { timeout: 30000 })
    .catch(() => log("warn: network-hashrate text did not appear in time"));

  const text = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");

  const netM = text.match(/Network hashrate\s+([\d.]+)\s*([kMGTP]?)H\/s/i);
  // Pool "Hashrate" appears separately; strip the network stat first so we don't match it.
  const poolM = text
    .replace(/Network hashrate\s+[\d.]+\s*[kMGTP]?H\/s/i, " ")
    .match(/Hashrate\s+([\d.]+)\s*([kMGTP]?)H\/s/i);
  const heightM = text.match(/Height\s+([\d,]+)/i);

  if (!netM || !poolM) throw new Error("could not parse pool/network hashrate from page");

  const net = toHps(netM[1], netM[2]);
  const pool = toHps(poolM[1], poolM[2]);
  if (!(net > 0) || !(pool >= 0)) throw new Error(`bad values pool=${pool} net=${net}`);

  const share = Math.round((pool / net) * 100 * 1000) / 1000;
  const out = {
    pool: "ninjaraider",
    share,
    pool_hps: pool,
    net_hps: net,
    height: heightM ? Number(heightM[1].replace(/,/g, "")) : null,
    source: URL,
    updated: new Date().toISOString(),
  };
  log(`ok pool=${poolM[0]} net=${netM[0]} share=${share}% in ${Date.now() - t0}ms`);
  process.stdout.write(JSON.stringify(out));
} finally {
  await browser.close();
}

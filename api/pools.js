// api/pools.js — live BTX pool network-share aggregator.
//
// Most BTX pool stat APIs don't send CORS headers, so the static page can't read
// them directly from the browser. This Vercel serverless function fetches them
// server-side (no CORS limits) and returns one combined, same-origin payload:
//
//   { updated, network: { nps, height, block_time_s }, pools: { <id>: <pct>, ... } }
//
// ninjaraider is intentionally absent — its stats are WebSocket-only (socket.io),
// so the page keeps its baked-in snapshot for that one card.

const TIMEOUT_MS = 6000;

async function fetchJson(url) {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'user-agent': 'btxlinks/1.0 (+https://btxlinks.vercel.app)' },
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

const num = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// Each source resolves to { share<percent>, net<nps>, height } or throws.
const SOURCES = {
  async minebtx() {
    const d = await fetchJson('https://stats.minebtx.com/stats');
    const s = num(d?.pool?.pool_share_of_network);
    return { share: s == null ? null : s * 100, net: num(d?.pool?.network_hash_nps), height: num(d?.health?.btxd?.blocks) };
  },
  async poolbtx() {
    const d = await fetchJson('https://poolbtx.com/stats');
    const s = num(d?.hashrate?.pool_share_1h) ?? num(d?.hashrate?.pool_share_live);
    return { share: s == null ? null : s * 100, net: num(d?.hashrate?.network_nonce_rate_nps), height: num(d?.network?.chain_height) };
  },
  async byron() {
    const d = await fetchJson('https://btxbyronbay.com/stats');
    // block_share_pct_* are already percentages.
    const s = num(d?.block_share_pct_live) ?? num(d?.block_share_pct_1h) ?? num(d?.block_share_pct_1w);
    return { share: s, net: num(d?.network_matmul_hps_live), height: num(d?.height) };
  },
  async ['btx-pool']() {
    const d = await fetchJson('https://btx-pool.com/api/stats');
    const net = num(d?.net_hashps);
    const pool = num(d?.pool_hashps);
    return { share: net && pool != null ? (pool / net) * 100 : null, net, height: num(d?.height) };
  },
  async bitminerpool() {
    const d = await fetchJson('https://api.bitminerpool.xyz/api/pool');
    const direct = num(d?.stats?.pool?.network_share_percent); // already a percent
    const frac = num(d?.stats?.pool?.pool_share_of_network);
    const s = direct ?? (frac == null ? null : frac * 100);
    return { share: s, net: num(d?.stats?.network?.network_hash_nps), height: num(d?.chain?.height) };
  },
  async luckypool() {
    const d = await fetchJson('https://btx.luckypool.io/api/stats');
    const pool = num(d?.pool?.hashrate);
    const net = num(d?.network?.hashrate);
    return { share: pool != null && net ? (pool / net) * 100 : null, net, height: num(d?.network?.height) };
  },
  // ninjaraider has no public stat API (WebSocket-only), so the ninjaraider-share
  // GitHub Action scrapes its dashboard every ~20 min and publishes here.
  async ninjaraider() {
    const d = await fetchJson('https://raw.githubusercontent.com/vanities/btxlinks/data/ninjaraider.json');
    return { share: num(d?.share), net: null, height: num(d?.height) };
  },
};

async function collect() {
  const t0 = Date.now();
  const ids = Object.keys(SOURCES);
  const settled = await Promise.allSettled(
    ids.map(async (id) => {
      const s = Date.now();
      try {
        const v = await SOURCES[id]();
        console.log(`[pools] ${id} ok share=${v.share == null ? 'null' : v.share.toFixed(3)} in ${Date.now() - s}ms`);
        return v;
      } catch (e) {
        console.warn(`[pools] ${id} fail in ${Date.now() - s}ms: ${e && e.message}`);
        throw e;
      }
    })
  );

  const pools = {};
  let net = null;
  let height = null;
  settled.forEach((res, i) => {
    if (res.status !== 'fulfilled') return;
    const v = res.value;
    if (v && v.share != null && isFinite(v.share)) {
      pools[ids[i]] = Math.round(v.share * 1000) / 1000;
      if (net == null && v.net) net = v.net;
      if (height == null && v.height) height = v.height;
    }
  });

  console.log(`[pools] aggregate ${Object.keys(pools).length}/${ids.length} pools in ${Date.now() - t0}ms`);
  return { updated: new Date().toISOString(), network: { nps: net, height, block_time_s: 90 }, pools };
}

module.exports = async (req, res) => {
  try {
    const data = await collect();
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('cache-control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).send(JSON.stringify(data));
  } catch (e) {
    console.error(`[pools] handler error: ${e && e.message}`);
    res.status(502).json({ error: 'aggregate_failed', message: String((e && e.message) || e) });
  }
};

// exported for local testing
module.exports.collect = collect;

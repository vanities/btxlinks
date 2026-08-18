# BTX Links

**Live → [btxlinks.com](https://btxlinks.com)**

A small, open-source directory of community links for **BTX** — the post-quantum
Bitcoin fork that uses **matrix-multiplication proof-of-work** and lattice-based,
quantum-resistant keys.

> ⚠️ **Mostly unaffiliated.** Apart from the **Official** section, every project listed here is
> community-run and is **not affiliated with, nor endorsed by, the original BTX
> developers.** This page only collects links. Verify each URL yourself before pointing
> hardware — or funds — at it.

## What's here

A single self-contained `index.html` — no build step, no dependencies, no tracking.
Open it in a browser, or host it on any static host (GitHub Pages, Vercel, Netlify, …).

### Official
- [btx.dev](https://btx.dev/) — **official** developer hub: node releases, docs, REST API, whitepapers, source
- [BTX Node](https://github.com/btxchain/btx) — **official** reference node (C++): full node, wallet, mining infra; MatMul PoW + post-quantum sigs
- [BTX Price](https://btxprice.com/) — **official** price dashboard: live model price, market cap, MatMul rate, JSON API
- [BTX Telegram](https://t.me/btx_ecosystem) — **official** Telegram channel (announcements & releases); private — verify via the gate to get in

### Pools
- [minebtx](https://minebtx.com) — no-node pool with a one-line installer, live dashboard + block explorer
- [Byron Pool](https://btxbyronbay.com) — Australian PPLNS collective, self-custody

### Miners
- [matador](https://github.com/vanities/matador-miner) — performance GPU miner, ready-to-run binary releases (Linux + Apple Silicon), 1% dev fee
- [easyBTX](https://easybtx.com/) — one-click NVIDIA RTX miner with a built-in wallet, 5% dev fee

### Wallets
- [BTX PQ Wallet](https://easybtx.com/wallet) — post-quantum desktop wallet, ML-DSA / SLH-DSA (independent beta, unsigned)
- [Bonuz](https://www.bonuz.xyz) — seedless, self-custodial iOS wallet with BTX support

### Explorers
- [BTXplorer](https://explorer.minebtx.com/) — open-source block explorer; search blocks, transactions, and addresses
- [first light](https://explorer.btxbyronbay.com/) — Byron Pool's BTX explorer; blocks, transactions, and network/chain-health stats
- [BTXInfo](https://btxinfo.com) — community data terminal: live price, mining-economics calculator, hashrate history, rich list; open JSON API
- [BTXScan](https://btxscan.io/) — block explorer; search blocks, transactions, and addresses, plus a next-halving tracker

### Community
- [BTX Discord](https://discord.gg/btx) — community Discord; open to everyone, no gate
- [BTX on X](https://x.com/btxcommunity) — community X account
- [BTX Community Chat](https://t.me/btx_ecosystem) — main community Telegram; private — same gate as above, verifying lets you into both
- [matador chat](https://t.me/+wy07HLBwE4kwNTkx) — Telegram group for the matador miner

## Run locally

```bash
open index.html            # macOS — just open the file
# …or serve it:
python3 -m http.server     # then visit http://localhost:8000
```

## Add or fix a link

Cards are plain HTML — no framework. Duplicate any `<a class="card …">` block in
`index.html`, change the `href`, name, tags, and description, bump the index number,
and open a pull request.

## License

[MIT](LICENSE) © 2026 Adam Mischke

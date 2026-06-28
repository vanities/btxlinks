# BTX Links

A small, open-source directory of community links for **BTX** — the post-quantum
Bitcoin fork that uses **matrix-multiplication proof-of-work** and lattice-based,
quantum-resistant keys.

> ⚠️ **Not affiliated.** Every project listed here is community-run and is **not
> affiliated with, nor endorsed by, the original BTX developers.** This page only
> collects links. Verify each URL yourself before pointing hardware — or funds — at it.

## What's here

A single self-contained `index.html` — no build step, no dependencies, no tracking.
Open it in a browser, or host it on any static host (GitHub Pages, Vercel, Netlify, …).

### Pools
- [minebtx](https://minebtx.com) — no-node pool with a one-line installer, live dashboard + block explorer
- [poolbtx](https://poolbtx.com) — live payouts, per-machine scoring · `stratum poolbtx.com:3333`
- [bitminerpool](https://bitminerpool.xyz) — alternate pool endpoint
- [Byron Pool](https://btxbyronbay.com) — Australian PPLNS collective, self-custody

### Miners
- [matador](https://github.com/vanities/matador-miner) — performance GPU miner, ready-to-run binary releases (Linux + Apple Silicon)
- [easyBTX](https://easybtx.com/) — one-click NVIDIA RTX miner with a built-in wallet

### Wallets
- [BTX PQ Wallet](https://easybtx.com/wallet) — post-quantum desktop wallet, ML-DSA / SLH-DSA (independent beta, unsigned)
- [Bonuz](https://www.bonuz.xyz) — seedless, self-custodial iOS wallet

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

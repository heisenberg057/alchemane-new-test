# Performance spot-check (Phase F)

Run the same checks **before and after** a deploy (same device profile, same throttling).

## URLs

- `/` (home)
- `/will-my-hairline-look-real`
- `/results`
- `/scalp-micropigmentation`
- `/blog` and one `/blog/{slug}`
- One heavy legacy slug from `[...slug]` (e.g. `/hair-patch-vs-hair-system`)

## Chrome DevTools

1. Open **Lighthouse** (or **Performance** → **Web Vitals**).
2. Mode: **Navigation**; Device: **Mobile**; Throttling: **4G** or **Slow 4G**.
3. Record: **LCP**, **INP** (field data if available), **CLS**, **Total blocking time**, **Network** transfer size, **Main thread** time.

## What changed recently (what to validate)

- **Legacy marketing routes** load their React page in a **separate JS chunk** (first paint is still HTML; scroll/interact early on slow networks).
- **Internal page-view analytics** mount after **idle** (very short internal traffic may miss the first hit—acceptable tradeoff for main-thread relief).
- **Blog post**: share buttons and comment form load as **dynamic** chunks.

## Optional CLI

If `lighthouse` is installed globally:

```bash
lighthouse https://americanhairline.com/ --only-categories=performance --output=json --output-path=./lh-home.json
```

Compare `lh-home.json` between runs; keep the same Lighthouse version when comparing.

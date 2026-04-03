# Velvet Nail Bar

**Type:** Boutique nail studio — manicure, pedicure, nail art
**Location:** Amsterdam, Netherlands (demo)
**Pipeline:** LeadForge AI by GrowthSite Lab

## Design System

- **Heading font:** Playfair Display (600, 700)
- **Body font:** Inter (300, 400, 500)
- **Primary bg:** #FAF7F5 (warm white)
- **Accent:** #C09080 (rose-gold copper)
- **Dark sections:** #1A1210
- **Mood:** Artisanal boutique, intimate scale, blush and rose-gold palette

## Images Required

Place the following files in `assets/images/` before launch:

- `gallery-1.webp` — Close-up of hand-painted floral nail art on short almond nails (600×600)
- `gallery-2.webp` — Minimalist nude gel manicure with thin gold line accent (600×600)
- `gallery-3.webp` — Dark burgundy gel nails with matte topcoat, square shape (600×600)
- `gallery-4.webp` — Abstract soft swirl nail art in peach and cream tones (600×600)
- `gallery-5.webp` — French tip variation with soft blush base and thin white line (600×600)
- `gallery-6.webp` — Close-up of nail extension filing process at Velvet Nail Bar (600×600)
- `about-studio.webp` — Studio interior, single workstation, warm lighting (600×700)

All images should be WebP format. Optimize to under 120 KB each for fast load times.

## To Serve Locally

```bash
npx serve ./sites/velvet-nail-bar -p 3001
```

## To Validate HTML

```bash
npx html-validate ./sites/velvet-nail-bar/index.html
```

## File Structure

```
velvet-nail-bar/
  index.html
  css/
    styles.css
  js/
    main.js
  assets/
    images/
      gallery-1.webp ... gallery-6.webp
      about-studio.webp
    icons/
```

## Pipeline Notes

- Researcher: `research/velvet-nail-bar/research-report.md`
- Site plan: `research/velvet-nail-bar/site-plan.md`
- Copy: `research/velvet-nail-bar/content.md`
- Coder output: this directory
- Next step: tester agent → `sites/velvet-nail-bar/test-report.md`

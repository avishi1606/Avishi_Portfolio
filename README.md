# Avishi Tyagi — Portfolio Website

Personal portfolio. No frameworks, no templates, no build step.

## Stack
- HTML5 · CSS3 (custom properties, grid, flexbox) · Vanilla JS
- Fonts: Playfair Display + JetBrains Mono + Outfit (Google Fonts)

## File Structure
```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   └── photo.jpg     ← replace this with your actual photo
└── README.md
```

## Before You Push — Checklist
1. **Replace `images/photo.jpg`** with your real photo
   - Portrait orientation recommended
   - Minimum 600 × 750 px, face centred
   - Name it exactly `photo.jpg` (or update the src in index.html)
2. **Fill your GitHub link** — search for `[your-github-link]` in index.html
3. **Replace `your-github-handle`** in the contact section
4. **Update project GitHub hrefs** — search for `href="#"` in the Projects section
5. **Set your exact CGPA** — replace `9.X` in the hero stats and about card

## Go Live

### GitHub Pages (free, recommended)
```bash
cd portfolio
git init
git add .
git commit -m "portfolio: initial"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```
Then: **Settings → Pages → Source: main, / (root)**
Live at: `https://YOUR_USERNAME.github.io`

### Netlify Drop (30 seconds)
Drag the `portfolio/` folder to: https://app.netlify.com/drop

## Customisation
All colors are CSS variables in `css/style.css` under `:root {}`.
Change `--amber` and `--amber-bright` to shift the accent color across the whole site.

## License
MIT

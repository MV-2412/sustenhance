# Sust.Enhance, Meenu Shevetha Nutrition Website

A static site for Meenu Shevetha's nutrition coaching practice, Sust.Enhance.
No backend, no build step, no login, plain HTML/CSS/JS deployed as-is.

**Live site:** https://mv-2412.github.io/sustenhance/

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home / About: Meenu's intro, real client plates gallery, transformation before/afters, "how it works" |
| `services.html` | Full breakdown of every service offered (Clinical, Sports, Wellness, Bespoke, add-ons) |
| `assessment.html` | Free 5-question quiz that gives visitors a personalized "Nutrition Profile" and pushes them to book a call |
| `calculators.html` | BMI / calorie / water intake calculators |
| `testimonials.html` | Client quote carousel + WhatsApp feedback screenshot gallery |
| `contact.html` | Booking form + contact details (email, WhatsApp, Instagram) |

Shared assets:
```
css/style.css        # all styling, one file for every page
js/script.js         # nav toggle, sticky header, scroll-reveal animation (shared)
js/assessment.js      # assessment quiz logic + results
js/contact.js         # contact form submission
js/calculators.js     # calculator logic
images/                # photos, logo, favicon, watermark
```

## Branding assets

- `images/logo.png`: Meenu's "MS" monogram, transparent background, recolored
  to the site's ink green so it sits cleanly in the nav on the cream header.
- `images/favicon.png`: same monogram on a gold circle, used as the browser
  tab icon on every page.
- `images/logo-watermark.png`: a low-opacity version of the logo, placed via
  a fixed `body::before` pseudo-element in `style.css` so it shows faintly,
  centered, behind content on every page (works on mobile Safari too, unlike
  `background-attachment: fixed`).

## Real content already wired in

Unlike a template, these are live, not placeholders:
- Email: `dieticianmeenu@gmail.com`
- WhatsApp: `+91 63794 03186`
- Instagram: `@dietician.meenu`
- Booking form and the assessment quiz both submit via [Web3Forms](https://web3forms.com) straight to Meenu's inbox, no backend to maintain.

## Test locally

Just open `index.html` in a browser, or serve the folder so relative paths
and the contact form behave exactly like production:
```
cd sustenhance
python -m http.server 8000
```
then visit `http://localhost:8000`.

## Deployment

The site is deployed with **GitHub Pages**, served from the `main` branch of
this repo. Any push to `main` rebuilds the live site automatically, usually
within a minute or two:
```
git add -A
git commit -m "your change"
git push
```
No separate deploy step, no Netlify/Vercel account needed.

## Editing content

- **Services / copy**: edit the relevant `.html` file directly; there's no templating.
- **Assessment quiz questions or results**: `assessment.html` (question markup) and `js/assessment.js` (the `ARCHETYPES`, `BARRIER_INSIGHTS`, `PATTERN_NOTES`, and `URGENCY_NOTES` objects control the personalized result copy).
- **Colors**: all defined once as CSS variables at the top of `css/style.css` (`--ink`, `--gold`, `--paper`, etc.), used everywhere else.
- **Client photos / transformations**: drop new images into `images/` and add an `<img>` tag in the relevant gallery (`.client-plates-grid` and `.transformations-gallery` on `index.html`, `.feedback-gallery` on `testimonials.html`).

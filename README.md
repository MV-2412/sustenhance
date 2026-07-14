# Sustenhance — Meenu Shevetha Nutrition Website

A complete, ready-to-launch static website. No login, no backend server, no
restricted access — once deployed, anyone with the link can view and use it.

## 1. Before you go live — replace these placeholders

Email address and WhatsApp number appear on multiple pages (`contact.html`,
and the "Book a Consultation" links in every page's nav/footer) — search
across all `.html` files for each of these:

| What | Where | Replace with |
|---|---|---|
| Email address | `mailto:hello@sustenhance.com` (appears on several pages) | Meenu's real email |
| ~~WhatsApp number~~ | ~~`https://wa.me/910000000000`~~ | Done — set to `+91 63794 03186` |
| Form inbox | `contact.html`, `contact-form action="https://formsubmit.co/hello@sustenhance.com"` | Same real email — first submission triggers a one-time confirmation email from FormSubmit, click it to activate the form |
| Instagram link | `contact.html`, `<a href="#" ...>@sustenhance</a>` | Real Instagram profile URL |
| About photo | `index.html` and `about.html`, `about-photo-placeholder` div | Swap for a real `<img src="images/meenu.jpg">` once you have a photo (drop the file into the `images/` folder) |
| Testimonials | `index.html`, `testimonials` section | Replace placeholder quotes with real client testimonials once collected (get their OK first) |
| Stats (5+ yrs / 500+ clients / 4.9★) | `index.html`, hero section `.hero-trust` | Update to real numbers |
| Blog articles | `blogs.html` | Replace sample articles with real ones as they're written |
| Recipes | `recipes.html` | Replace or add recipes as needed |

Everything else (services, process, colors, layout, calculators, assessment
quiz) is ready to use as-is, and can be freely edited later.

## 2. Test locally

Just double-click `index.html` to open it in a browser, or right-click →
Open with → your browser of choice. No install needed.

## 3. Go live for free with Netlify (no account restrictions for visitors)

**Fastest option — drag and drop, no CLI:**

1. Go to https://app.netlify.com/drop
2. Drag the whole `sustenhance` folder onto the page
3. Netlify gives you a live public URL immediately (e.g. `random-name-123.netlify.app`)
4. Optional: click "Site settings" → "Change site name" to get a nicer URL like `sustenhance.netlify.app`
5. Optional: connect a custom domain (e.g. `sustenhance.com`) under "Domain settings" if Meenu buys one

**No sign-in is required for visitors** — the site is fully public the moment it deploys.

**CLI option (if you prefer):**
```
npm install -g netlify-cli
cd D:/sustenhance
netlify deploy --prod
```

## 4. Folder structure

```
sustenhance/
├── index.html          # home page
├── about.html           # about Meenu
├── services.html        # full service details
├── assessment.html      # free 4-question service-recommendation quiz
├── recipes.html         # sample recipes
├── blogs.html           # sample articles
├── calculators.html     # BMI / calorie / water intake calculators
├── contact.html         # booking + contact form
├── css/style.css        # styling (shared by all pages)
├── js/script.js         # nav, scroll reveal, sticky header (shared)
├── js/assessment.js     # assessment quiz logic
├── js/calculators.js    # calculator logic
├── images/               # put real photos here
└── README.md             # this file
```

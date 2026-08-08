# Ghoont · घूंट — website

Static site. No build step, no dependencies, no server. Every page is plain HTML sharing one stylesheet and one script.

```
index.html      home
shop.html       all five products
matcha.html     product pages
hojicha.html
ube.html
kit.html
sachets.html
brewing.html    temperature guide + interactive dial
receipts.html   grind dates, lab reports, grading
story.html      about
help.html       FAQ accordion
cart.html       bag (renders from localStorage)
404.html        GitHub Pages serves this automatically
assets/style.css
assets/app.js
```

The bag persists across page loads via `localStorage`, so adding on a product page and then opening `cart.html` works. Checkout is deliberately inert — it needs a real payment gateway.

---

## Publish it free on GitHub Pages

You need a GitHub account. Total time about ten minutes.

### 1. Create the repository
- Go to **github.com** → sign in → click **+** (top right) → **New repository**
- **Repository name:** `ghoont` (or `ghoont-website`)
- Set it to **Public** — GitHub Pages needs public on free accounts
- Do **not** tick "Add a README" — you already have one
- Click **Create repository**

### 2. Upload the files
On the empty repo page, click **uploading an existing file**, then:
- Drag in every `.html` file **and** the whole `assets` folder
- Important: the files must sit at the **top level** of the repo, not inside a `ghoont-website/` folder. If you drag the folder itself, GitHub will nest it and your URLs will gain an extra segment.
- Scroll down, type `first commit` in the message box, click **Commit changes**

### 3. Turn on Pages
- In the repo, click **Settings** (top bar)
- Left sidebar → **Pages**
- Under **Source**, choose **Deploy from a branch**
- **Branch:** `main`, folder: `/ (root)` → **Save**

### 4. Wait, then visit
Give it one to three minutes, then open:

```
https://YOUR-USERNAME.github.io/ghoont/
```

If you see the old page or nothing, hard-refresh (Ctrl+Shift+R, or Cmd+Shift+R on Mac).

---

## Using your own domain

GitHub Pages supports custom domains free — you only pay the registrar for the domain itself (`ghoont.in` runs roughly ₹700–1,200 a year).

1. Buy the domain (BigRock, GoDaddy, Namecheap, Cloudflare)
2. In your registrar's DNS panel, add four **A records** for `@` pointing to:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. Add a **CNAME record** for `www` pointing to `YOUR-USERNAME.github.io`
4. Back in **Settings → Pages → Custom domain**, enter `ghoont.in` and Save
5. Tick **Enforce HTTPS** once it becomes available (can take up to 24 hours)

DNS changes usually apply within an hour but can take a day.

---

## Editing later

Easiest route: open the file on github.com, click the pencil icon, edit, commit. The site rebuilds in about a minute.

Changing a price means editing it in **two** places — the product's HTML page and the `P` object at the top of `assets/app.js`, which the bag reads from. If those disagree, the cart total will be wrong.

---

## Before this goes live

- [ ] Replace the placeholder tin graphics with real product photography
- [ ] Make the strike-through prices real former prices — inflated MRP is a Legal Metrology problem in India, not just a taste one
- [ ] Delete or replace anything you can't substantiate yet (batch dates, lab reports)
- [ ] Add your real FSSAI licence number in the footer of every page
- [ ] Add Shipping, Returns, Privacy and Terms pages — required for a payment gateway
- [ ] Wire up checkout: Razorpay payment links are the quickest route on a static site, or rebuild on Shopify using these pages as the spec
- [ ] Confirm the Devanagari renders correctly with a native reader before it reaches packaging

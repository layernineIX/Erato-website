# ERATO — Website

A design studio site translating art history, Pop Art, cinema and photography into wearable and collectible objects.

Static site — no build step, no framework. `index.html` + `css/styles.css` + `js/main.js` + `assets/`.

**Domain:** eratodesign.store
**Art direction / imagery prompts:** see `/content`

---

## Deploy: GitHub → Cloudflare Pages → eratodesign.store

You already have GitHub and Cloudflare accounts (from Layer Nine). Five steps, ~10 minutes total.

### 1. Create the GitHub repo
Go to [github.com/new](https://github.com/new):
- Repository name: `erato-website`
- Keep it **Public** or **Private**, your call — doesn't affect deployment
- Do **not** initialize with a README (this folder already has one)
- Click **Create repository**

### 2. Push this folder to it
Open Terminal, `cd` into this `erato-website` folder, then run:

```bash
git init
git add .
git commit -m "ERATO website — initial homepage"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/erato-website.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If prompted to log in, use your existing GitHub credentials.

### 3. Connect the repo to Cloudflare Pages
In the [Cloudflare dashboard](https://dash.cloudflare.com):
- **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
- Authorize Cloudflare to access GitHub (if not already) and select the `erato-website` repo
- Build settings: leave **Framework preset** as *None*, **Build command** blank, **Build output directory** as `/` (root)
- Click **Save and Deploy**

Cloudflare will give you a live URL like `erato-website.pages.dev` within a minute or two.

### 4. Point eratodesign.store at it
Still in the Pages project → **Custom domains** → **Set up a custom domain** → enter `eratodesign.store` (and `www.eratodesign.store` if you want both).
- If the domain's DNS is already on Cloudflare, this is one click — it adds the CNAME automatically.
- If eratodesign.store isn't on Cloudflare DNS yet, add it first under **Websites** → **Add a site**, then repeat this step.

### 5. Done
Every future `git push` to `main` auto-redeploys the live site. That's the whole workflow going forward — no manual re-uploading.

---

## What's next (content)

The homepage is intentionally typography- and color-led right now — no photography yet. The four color-field cards in the "First Collection" section are placeholders that map 1:1 to the four Higgsfield prompts in `content/ERATO_Higgsfield_Prompts.md`.

Once real campaign images are generated:
1. Drop the image files into `assets/`
2. In `index.html`, replace the relevant `.field` div (search for `IMAGE SLOT` comments) with an `<img>` tag
3. Commit and push — Cloudflare redeploys automatically

## Structure

```
erato-website/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/erato-logo.png
├── content/                     ← reference docs, not part of the live site
│   ├── ERATO_Art_Direction_v1.html
│   └── ERATO_Higgsfield_Prompts.md
└── README.md
```

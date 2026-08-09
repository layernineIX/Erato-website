# ERATO — Website

Static site, no build step. Deployed via GitHub → Cloudflare Workers → eratodesign.store.

## Structure
```
erato-website/
  index.html
  css/styles.css
  js/main.js
  assets/erato-logo.png
  assets/campaign/*.jpg
  content/  (art direction + prompt reference docs)
```

## Updating the live site
1. Unzip this package.
2. On GitHub, open the `erato-website` repo.
3. Delete the existing contents of the repo (select all → Delete files → commit) if doing a full refresh, or navigate into the matching subfolder to overwrite specific files.
4. Add file → Upload files → drag the entire unzipped `erato-website` folder in → commit directly to `main`.
5. Cloudflare Workers auto-builds from the connected repo — check the Deployments tab for the new deploy, then confirm at eratodesign.store.

No build command, no install step — it's just static files.

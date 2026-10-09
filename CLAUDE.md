# ERATO website — handoff notes

Static HTML/CSS/JS site (no build step). Repo: layernineIX/Erato-website. Push to `main` → Cloudflare Workers deploys. NOT Shopify.
Owner: Ali (Layer Nine / ERATO). Currency: USD. Tees USD 44, totes USD 24, prints A4 19 / A3 29 / A2 49 / A1 69 (placeholders).

## Rules
- Keep Jost font and CSS variables in css/styles.css (warm tokens --plaster, --wood, --terra, --teal added at the bottom "SYNC" block).
- Tees must look real, clean, chic. Accessibility: skip-to-shop link, prefers-reduced-motion.
- Do NOT use Higgsfield or any image-generation tool. Ali generates images himself and uploads them.
- Local preview: `python3 -m http.server 8767` from repo root (wardrobe hover needs http, not file://).

## Hero (index.html + js/wardrobe.js)
Flow now: closed → click → doors open (NO zoom) → click an item (tee/tote/shoes) zooms to its group (tees / shelf / floor) → click item = pull-out dialog. Items: 7 tees, shoes (Loom, USD 220, Balinese leather, black/navy/redbrown variants in assets/products/loom-*.jpg) and tote (Marble Study, USD 18, 38x42cm cotton) both on the shelf, real scale (~4.3 native px per cm). label.png values = (index+1)*25; ITEMS order must match: tees 0-6, shoes 7, tote 8, framed print (Riviera) 9 leaning in the bottom compartment (group floor). Rack overlay covers world y .17593–.7917 (h .61574).
Closed 16:9 room photo → hover "open me" → doors part → rack of 7 tees → zoom → hover/click pulls tee out ("Buy me" / "Know me better") → product page.
Assets in assets/hero/: closed.jpg, open.jpg (2560x1440), rack.jpg, label.png (hover lookup, value = (index+1)*30), layer-<key>.webp, pull-<key>.webp, meta.json.
Constants in wardrobe.js: ASPECT 16/9, RACK {x:.38542,y:.17593,w:.19792,h:.46296}, TEES array (key, slug, name, colour, tone).
Rack was composited with Python/OpenCV (not in repo): open photo interior opening x≈1533–2157, rail y≈533–557, shelf y≈1311 (3840x2160 native).

## Tees (7, USD 44, premium 280gsm oversized stone-washed cotton, A3 DTG back print)
horse=Caparison (Bone), mughal=Illuminated (Washed Charcoal), roses=Bloom (Bone), budapest=Concierge (Charcoal), nighthawks=Last Call (Bone), vertigo=Jade Room (Charcoal), wave=Kanagawa (Charcoal).
Pages: product-<slug>.html. Images: assets/tees/<key>-back.jpg, <key>-detail.jpg. Old 9 products (the-court, eden, etc.) still exist in collections.

## To do (in order)
1. Add new tees/designs (needs artwork from Ali) → product page + collections card + home grid (+ rack if room).
2. Prints page: real shop layout, product pages per print, sizes/prices.
3. Front view with ERATO logo left chest (needs front blank photos from Ali).
4. Checkout: "Add to Bag" is decorative; connect Stripe Payment Links (ask Ali).
5. Collections page: retire or group the 9 older pieces as "Archive".
6. Mobile QA, delete duplicate folder "erato-website 2".
Prints: product-riviera.html (framed, frame.py renders assets/products/riviera-*.jpg).

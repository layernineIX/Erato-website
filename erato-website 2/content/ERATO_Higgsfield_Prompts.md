# ERATO — Higgsfield Image Prompts (Step 3)

*Art direction: playful surreal editorial — art history staged as sunlit fashion.*
*Palette locked: `#308FBB` blue · `#E1E59B` lime · `#6C6425` olive · `#E1CB40` gold · `#EAE5D4` paper · `#1B1A15` ink.*

---

## How to use this

1. In Higgsfield, use **Nano Banana Pro** or **FLUX.2** (reasoning models — they read structured JSON best).
2. Generate the **Hero (Shot A) first** — it's the make-or-break image. Make 4–6 variations, pick the strongest.
3. Then run B, C, D. Keep the `STYLE`, `CINEMATOGRAPHY_AND_LIGHTING` and `HEX VALUES` blocks **identical** across all four so the set looks like one campaign. Only `SCENE`, `COMPOSITION` and `Caption` change.
4. Aspect ratios: **A** 4:5 or 3:4 (hero) · **B** 21:9 (cinema) · **C** 1:1 or 4:5 (product) · **D** 4:5.
5. Bring the winners back to me and we build the site (Step 5) around them.
6. Note on references: all use **public-domain** art (classical sculpture, Renaissance/Baroque painting) — safe to reproduce and reinterpret. Avoid prompting living artists' work by name.

> **The Master Look** = the shared `STYLE` + `CINEMATOGRAPHY_AND_LIGHTING` + `CAMERA_AND_LENS` + `HEX VALUES` blocks. They are the same in every prompt below. That shared DNA is what makes six different images feel like one brand.

---

## Shot A · THE HERO — "The muse wears it"

```json
{
  "Caption": "A weathered classical marble bust of a Greek muse, brought subtly to life, wears a crisp oversized off-white cotton t-shirt against a warm empty paper-toned wall; soft directional sunlight rakes across the marble, one shaft of gold light and a sliver of clear blue sky behind — serene, witty, impossibly elegant.",
  "STYLE": {
    "Artistic Medium": "photograph, high-end fashion editorial",
    "Aesthetic Movement / Genre": "surreal editorial minimalism; classical sculpture meets contemporary fashion campaign",
    "Cultural / Historical Influence": "Jacquemus campaign photography, Greco-Roman sculpture, museum plinth lighting, Bottega gallery restraint"
  },
  "COMPOSITION": {
    "Framing": "medium portrait, single subject, ~80mm, generous negative space above and to one side",
    "Layout": "bust off-centre in lower third; vast empty warm wall as background; one gold light shaft; small patch of blue sky",
    "Perspective": "eye-level, slight low angle for monumentality, no distortion"
  },
  "SCENE": {
    "Subject Characteristics": "aged white marble bust of a female muse, chipped and veined, faint lifelike softness in the eyes, wearing a clean oversized off-white heavyweight cotton crew t-shirt with no visible print, fabric draping naturally over stone shoulders",
    "Setting": "minimal sunlit gallery corner, warm off-white plaster wall",
    "Geographic / Cultural Context": "timeless — a modern museum staged like a fashion set"
  },
  "CINEMATOGRAPHY_AND_LIGHTING": {
    "Lighting Style": "single soft directional key like late-afternoon sun through a high window, gentle rim on the marble, soft natural shadow falloff",
    "Color Palette": "warm paper neutrals, marble white, one accent of clear cerulean blue and a shaft of warm gold",
    "Overall Color Tone": "filmic, warm, softly lifted blacks, natural and premium — not over-graded",
    "Tone & Mood": "serene, elevated, quietly surreal and a little witty"
  },
  "CAMERA_AND_LENS": {
    "Camera Type and Era": "modern medium-format digital",
    "Camera model": "Hasselblad H6D-100c",
    "Lens model": "Hasselblad HC 80mm f/2.8",
    "Lens size": "80mm",
    "Lens Effects": "clean, minimal flare, creamy natural bokeh",
    "Depth of Field": "subject sharp, background wall softly out of focus",
    "Film Grain / Noise": "fine, subtle medium-format grain"
  },
  "PHYSICAL_ATTRIBUTES": {
    "Material & Texture": "veined weathered marble, soft heavyweight cotton, matte plaster wall",
    "Physics & Effects": "natural cotton drape and fold over hard stone, soft dust in the light shaft",
    "Execution Style": "photoreal, practical-on-set feel"
  },
  "HEX VALUES": ["#308FBB", "#E1E59B", "#6C6425", "#E1CB40", "#EAE5D4", "#1B1A15"]
}
```

---

## Shot B · THE CINEMA CUT — the reference as a film still

```json
{
  "Caption": "A cinematic wide film-still: the same marble muse figure stands in a shadowed museum hall wearing the off-white ERATO tee, a single hard shaft of light cutting across the darkness, dust in the air — moody, narrative, like a frame from an art-house film.",
  "STYLE": {
    "Artistic Medium": "photograph, cinematic film still",
    "Aesthetic Movement / Genre": "art-house cinema, neo-classical drama; surreal editorial",
    "Cultural / Historical Influence": "A24 film posters, chiaroscuro painting (Caravaggio), museum-at-night atmosphere"
  },
  "COMPOSITION": {
    "Framing": "wide, letterboxed 21:9, subject small within a large architectural space, ~35mm",
    "Layout": "figure off-centre, deep empty hall, strong diagonal shaft of light as leading line",
    "Perspective": "wide architectural perspective, gentle converging lines"
  },
  "SCENE": {
    "Subject Characteristics": "the same weathered marble muse figure, full or three-quarter length, wearing the clean oversized off-white cotton tee",
    "Setting": "grand dim museum hall at dusk, tall walls, stone floor",
    "Geographic / Cultural Context": "classical European museum interior, timeless"
  },
  "CINEMATOGRAPHY_AND_LIGHTING": {
    "Lighting Style": "single hard directional shaft (window or skylight) into near-darkness, deep shadows, faint blue ambient fill",
    "Color Palette": "deep shadow neutrals and teal-blue dark, one warm gold shaft, marble white subject",
    "Overall Color Tone": "cinematic, crushed but not black-clipped, filmic contrast",
    "Tone & Mood": "dramatic, contemplative, cinematic tension"
  },
  "CAMERA_AND_LENS": {
    "Camera Type and Era": "modern digital cinema",
    "Camera model": "ARRI Alexa Mini LF",
    "Lens model": "Cooke S4/i",
    "Lens size": "35mm",
    "Lens Effects": "subtle anamorphic-style flare, soft highlight roll-off",
    "Depth of Field": "moderate, subject and shaft in focus, edges soft",
    "Film Grain / Noise": "fine cinematic 35mm grain"
  },
  "PHYSICAL_ATTRIBUTES": {
    "Material & Texture": "marble, cotton, aged stone floor, atmospheric haze",
    "Physics & Effects": "visible dust and haze in the light shaft, long soft shadows",
    "Execution Style": "photoreal cinematic"
  },
  "HEX VALUES": ["#308FBB", "#E1E59B", "#6C6425", "#E1CB40", "#EAE5D4", "#1B1A15"]
}
```

---

## Shot C · THE OBJECT — product as museum artefact

```json
{
  "Caption": "A single folded off-white ERATO t-shirt rests on a pale stone plinth under soft museum light, framed like a precious artefact against a warm paper backdrop with a faint lime-tinted shadow — calm, catalogue-clean, collectible.",
  "STYLE": {
    "Artistic Medium": "photograph, still-life product photography",
    "Aesthetic Movement / Genre": "gallery catalogue minimalism, museum object display",
    "Cultural / Historical Influence": "auction-house catalogues, museum artefact vitrines, Bottega product restraint"
  },
  "COMPOSITION": {
    "Framing": "centred or slightly off-centre still life, ~100mm, lots of clean space",
    "Layout": "single object on a low stone plinth, soft cast shadow, empty warm background",
    "Perspective": "near eye-level, minimal, honest"
  },
  "SCENE": {
    "Subject Characteristics": "one neatly folded oversized off-white heavyweight cotton t-shirt (or alternatively a framed art print / small accessory), pristine, no loud graphics",
    "Setting": "seamless warm paper-toned studio with a pale stone plinth",
    "Geographic / Cultural Context": "neutral gallery studio"
  },
  "CINEMATOGRAPHY_AND_LIGHTING": {
    "Lighting Style": "large soft top-key like a museum vitrine, gentle gradient falloff, one soft shadow",
    "Color Palette": "warm paper neutrals, soft lime-tinted shadow, subtle gold highlight",
    "Overall Color Tone": "clean, warm, natural, premium catalogue",
    "Tone & Mood": "calm, reverent, collectible"
  },
  "CAMERA_AND_LENS": {
    "Camera Type and Era": "modern medium-format digital",
    "Camera model": "Hasselblad H6D-100c",
    "Lens model": "Hasselblad HC 100mm f/2.2",
    "Lens size": "100mm",
    "Lens Effects": "clean, no flare, precise",
    "Depth of Field": "object fully sharp, background soft",
    "Film Grain / Noise": "very fine, near-clean"
  },
  "PHYSICAL_ATTRIBUTES": {
    "Material & Texture": "heavyweight cotton weave, matte pale stone plinth, matte paper backdrop",
    "Physics & Effects": "crisp fabric folds, soft grounded contact shadow",
    "Execution Style": "photoreal studio still life"
  },
  "HEX VALUES": ["#308FBB", "#E1E59B", "#6C6425", "#E1CB40", "#EAE5D4", "#1B1A15"]
}
```

---

## Shot D · THE REINTERPRETATION — artwork recomposed

```json
{
  "Caption": "A Renaissance-style portrait subject — poised like a Botticelli or Vermeer figure — reimagined wearing a modern off-white ERATO tee, set against a flat pop-art field of ERATO blue and gold; painterly meets graphic, a witty collision of old master and contemporary fashion.",
  "STYLE": {
    "Artistic Medium": "photograph with painterly treatment / hybrid editorial",
    "Aesthetic Movement / Genre": "pop-art meets old-master portraiture; fine-art parody",
    "Cultural / Historical Influence": "Botticelli / Vermeer portraiture, Warhol pop-art colour fields, contemporary fashion editorial"
  },
  "COMPOSITION": {
    "Framing": "portrait, chest-up, ~85mm, subject centred with bold flat colour background",
    "Layout": "classical portrait pose foreground; flat two-tone pop-art colour field behind (blue / gold split)",
    "Perspective": "frontal, painterly stillness"
  },
  "SCENE": {
    "Subject Characteristics": "a figure posed and lit like a Renaissance old-master portrait — soft period styling, serene expression — but wearing a clean oversized off-white cotton ERATO tee instead of period costume",
    "Setting": "studio with a flat graphic colour backdrop, no realism behind",
    "Geographic / Cultural Context": "timeless — historical portrait recontextualised into pop-art present"
  },
  "CINEMATOGRAPHY_AND_LIGHTING": {
    "Lighting Style": "soft old-master window light on the face (Vermeer-like), even light on the flat backdrop",
    "Color Palette": "cerulean blue and warm gold flat fields, natural skin, off-white tee",
    "Overall Color Tone": "painterly on the subject, saturated-flat on the background — deliberate contrast",
    "Tone & Mood": "elegant, witty, art-historical wink"
  },
  "CAMERA_AND_LENS": {
    "Camera Type and Era": "modern medium-format digital",
    "Camera model": "Hasselblad H6D-100c",
    "Lens model": "Hasselblad HC 80mm f/2.8",
    "Lens size": "80mm",
    "Lens Effects": "clean, minimal, painterly softness",
    "Depth of Field": "subject sharp, flat background evenly rendered",
    "Film Grain / Noise": "fine, subtle"
  },
  "PHYSICAL_ATTRIBUTES": {
    "Material & Texture": "soft skin and hair rendered painterly, matte flat backdrop, cotton tee",
    "Physics & Effects": "still, composed, no motion — a living painting",
    "Execution Style": "photoreal subject composited on flat graphic colour field"
  },
  "HEX VALUES": ["#308FBB", "#E1E59B", "#6C6425", "#E1CB40", "#EAE5D4", "#1B1A15"]
}
```

---

### Notes & choices
- **Marble muse as the recurring hero character** ties directly to the name ERATO (a Greek muse) — it gives the whole campaign one memorable protagonist instead of random art references.
- **The tee is always plain off-white** in these prompts so the *staging* sells the brand, not a printed graphic. Once you have real designs, we swap the plain tee for the actual product.
- **Palette is hard-locked via HEX** in every prompt; the colours appear as *light and background*, never as loud costume — keeping it chic.
- **Camera kept consistent** (Hasselblad for stills/portraits, ARRI only for the cinema cut) so the set shares one optical signature.
- If a generation comes out too literal or too busy, tell me what missed and I'll tune the exact fields.

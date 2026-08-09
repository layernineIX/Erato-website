# ERATO — Higgsfield Campaign Prompts

Reference set for the four core shot types used across the site (`assets/campaign/`). Palette: `#308FBB` blue · `#E1E59B` lime · `#6C6425` olive · `#E1CB40` gold. Concept: Playful surreal editorial — art history staged as fashion.

## Shot A — Hero
```json
{
  "Caption": "A classical marble statue wearing an ERATO t-shirt, standing in a sunlit colonnade",
  "STYLE": "Playful surreal editorial, art-history-meets-fashion, museum-cinematic",
  "COMPOSITION": "Centered subject, symmetrical colonnade framing, generous negative space",
  "SCENE": "Ancient stone colonnade, warm midday light, dust motes in the air",
  "CINEMATOGRAPHY_AND_LIGHTING": "Soft directional sunlight, long architectural shadows, warm golden tone",
  "CAMERA_AND_LENS": "35mm, eye-level, shallow depth of field",
  "PHYSICAL_ATTRIBUTES": "Marble statue texture, cotton t-shirt with visible weave, contrast between stone and fabric",
  "HEX_VALUES": ["#308FBB", "#E1CB40"]
}
```

## Shot B — Cinema Cut
```json
{
  "Caption": "Wide cinematic still, model mid-motion in a dark museum hall wearing ERATO",
  "STYLE": "Film-still cinematography, moody, high-contrast",
  "COMPOSITION": "Ultra-wide 21:9-leaning crop, subject off-center, negative space for text overlay",
  "SCENE": "Dark museum interior, single shaft of light",
  "CINEMATOGRAPHY_AND_LIGHTING": "Chiaroscuro lighting, deep shadow, single key light",
  "CAMERA_AND_LENS": "50mm anamorphic-style, low angle",
  "PHYSICAL_ATTRIBUTES": "Matte black background, fabric catching rim light",
  "HEX_VALUES": ["#1b1a15", "#E1E59B"]
}
```

## Shot C — Object
```json
{
  "Caption": "Folded ERATO t-shirt product shot, studio lighting, editorial styling",
  "STYLE": "Clean product editorial, gallery-object treatment",
  "COMPOSITION": "Centered, flat-lay or folded stack, ample negative space",
  "SCENE": "Neutral studio background, textured surface",
  "CINEMATOGRAPHY_AND_LIGHTING": "Soft top light, subtle shadow falloff",
  "CAMERA_AND_LENS": "Macro-adjacent, top-down or 3/4 angle",
  "PHYSICAL_ATTRIBUTES": "Visible cotton texture, crisp fold lines",
  "HEX_VALUES": ["#6C6425", "#f4f1e6"]
}
```

## Shot D — Reinterpretation
```json
{
  "Caption": "Renaissance-style portrait subject wearing an ERATO t-shirt, reinterpreted as a painted composition",
  "STYLE": "Painterly reinterpretation, Renaissance portraiture staged as fashion",
  "COMPOSITION": "Three-quarter portrait, classical framing",
  "SCENE": "Blue and gold painted backdrop, art-historical setting",
  "CINEMATOGRAPHY_AND_LIGHTING": "Soft Rembrandt-style lighting",
  "CAMERA_AND_LENS": "85mm portrait lens, shallow depth of field",
  "PHYSICAL_ATTRIBUTES": "Painterly skin rendering, fabric with visible texture",
  "HEX_VALUES": ["#308FBB", "#E1CB40"]
}
```

## Notes
- Additional variations (Hero Variation 2/3, Shot E — Print, Shot F — Colonnade Wide) were generated and shared directly in chat rather than filed here, per request.
- Known limitation: Higgsfield (and AI image models generally) cannot pixel-perfectly reproduce uploaded custom graphics/typography — the ERATO wordmark sometimes renders with distorted characters. For pixel-accurate product shots, composite the real graphic onto a generated garment shot in post rather than relying on generation alone.

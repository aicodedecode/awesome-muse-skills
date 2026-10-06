# Opus 5.5 video by @iamtanzil_

[▶ Watch the original and a live remake on Skillry](https://skillry.dev/ai-videos/opus-5-5/iamtanzil-675031?utm_source=github&utm_medium=readme&utm_campaign=awesome-opus5-5-videos) · [Original post](https://x.com/iamtanzil_/status/2103820321673675031)

- **Category:** 3D scenes
- **Remake built with:** Three.js · GSAP
- **Author:** [@iamtanzil_](https://x.com/iamtanzil_)

## Prompt

````text
# Auren Header

A cinematic, scroll-scrubbed 3D hero header for the luxury/fantasy brand "AUREN" where a full-screen background video plays frame-by-frame as the user scrolls through a 500vh section, with sequential timed overlays (title, description, feature cards, final title) revealing themselves at specific video timestamps.

## Tech stack
- React 18+ with "use client" directive (Next.js App Router compatible)
- framer-motion (all overlay entrance/exit animations, AnimatePresence, staggered per-character reveals)
- gsap + gsap/ScrollTrigger (scroll-driven scrubbing that maps scroll progress to video.currentTime)
- No icon library used; the arrow is a literal → character and the card overlay button is a literal + character

## Fonts & global styles
- Import via: `https://fonts.googleapis.com/css2?family=Italiana&family=Inter+Tight:wght@400;500&display=swap`
- Display / serif font: 'Italiana', serif — used for the AUREN logo, hero titles, card numbers, and card titles.
- Body / sans font: 'Inter Tight', sans-serif — weights 400 and 500 — used for nav text, descriptions, menu items, card subtitles/descriptions/buttons.
- box-sizing: border-box applied to the whole section and all descendants.
- Scope all styles to the section; do NOT set global body/html rules.

## Section container
- Root: `.auren-header-section` — position: relative; width: 100%; height: 500vh; background: #FEFFFE. The 500vh height is what creates the scroll runway for scrubbing.
- Inner sticky wrapper: `.auren-sticky-content` — position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden. Everything visible lives inside this sticky viewport.

## Structure, section by section
1. **Background video** `.auren-video-bg`: position absolute; inset 0; width/height 100%; object-fit: cover; object-position: center; z-index: 1. Element is `<video muted playsInline>` (NOT autoplay — playback is driven by scroll). Source: `https://cdn.jiro.build/Header%20Section/Auren3d/output.mp4` (type video/mp4). On ≤768px, object-position becomes 70% center.
2. **Navigation** `.auren-nav`: position absolute; top 0; left 0; width 100%; padding 40px 60px; display flex; justify-content space-between; align-items flex-start; z-index 2.
   - Logo `.auren-logo`: text "AUREN", Italiana 400, 26px, line-height 1, color #000000, letter-spacing 0.05em.
   - Center nav `.auren-nav-center`: absolutely centered (left 50%, translateX(-50%)); display flex; gap 15vw. Two `.auren-nav-text` blocks (Inter Tight 500, 16px, line-height 1.2, uppercase, color #000000, centered): first reads "COSMIC ARMORION" / "FORGED IN LIGHT" (two lines via <br/>); second reads "CHAPTER 07" / "CELESTIAL ARCHIVE".
   - Hamburger `.auren-menu-btn`: flex column; align-items flex-end; gap 5px; transparent, no border. Three `.auren-menu-line` bars, height 2px, background #161414; widths 22px / 15px / 22px. On hover the middle bar animates to 22px width (transition width 0.3s ease).
   - Dropdown `.auren-menu-dropdown` (toggled by hamburger): position absolute; top 60px; right 60px; width 150px; background rgba(255,255,255,0.8); backdrop-filter blur(10px); border-radius 8px; padding 10px; flex column gap 10px; border 1px solid rgba(0,0,0,0.1); z-index 20. Items `.auren-menu-item` (Inter Tight 500, 16px, #000, padding 8px, border-radius 4px, right-aligned, hover background rgba(0,0,0,0.05)): "Home", "About", "Contact".
3. **Timed hero title (initial, shown while videoTime < 2.5s)** `.auren-hero-title`: position absolute; left 60px; bottom 80px; max-width 400px; Italiana 400; 90px; line-height 1.13; color #000000; z-index 2. Words: "RISE", "OF THE", "ASTRAL", "GUARD", "MAN" — each on its own line (via <br/>), rendered per-character for the reveal animation.
4. **Timed hero description (initial, videoTime < 2.5s)** `.auren-hero-desc`: position absolute; right 60px; bottom 80px; max-width 320px; Inter Tight 400; 20px; line-height 1.4; color #2E2A2A; z-index 2. Text verbatim: "Enter a realm where ancient artistry meets futuristic armor. Discover legendary warriors, cosmic relics".
5. **Feature cards overlay (shown while 3s ≤ videoTime ≤ 4s)** `.auren-cards-container`: position absolute; bottom 100px; left 0; width 100%; flex; justify-content center; gap 60px; z-index 10. Two `.auren-card`s (each 560px × 320px; background linear-gradient(135deg, rgba(250,246,240,0.95), rgba(240,235,225,0.95)); border-radius 24px; padding 32px; flex; gap 30px; border 1px solid rgba(200,180,150,0.3); box-shadow 0 12px 40px rgba(0,0,0,0.15)):
     - Card content column: header row with number (Italiana 24px, #000) + a 30px × 1px line rgba(0,0,0,0.2); subtitle (Inter Tight 10px, letter-spacing 0.1em, uppercase, #666); title (Italiana 32px, line-height 1, #000, each word forced onto its own line via `.auren-br`); description (Inter Tight 12px, line-height 1.5, #444, margin-bottom auto); button row (`.auren-card-btn`, cursor pointer, color #000) with `.auren-card-btn-text` (Inter Tight 11px, weight 500, letter-spacing 0.05em) followed by a 14px →.
     - Card image `.auren-card-image`: 240px wide, full height, border-radius 16px, background-image from URL center/cover, with a `.auren-card-plus` badge bottom-right (32px circle, background #111, color #FFF, contains "+").
     - Card 1: number "01", subtitle "THE WARRIOR", title "ASTRAL GUARDIAN", desc "Forged in celestial alloy, the Guardian represents a balance of precision, power, and ancient craft.", button "EXPLORE GUARDIAN", image `https://cdn.jiro.build/Header%20Section/Auren3d/auren1.png`.
     - Card 2: number "02", subtitle "THE ARMOR", title "FORGED IN LIGHT", desc "Layered armor, luminous cores, and hand-forged celestial details built for the unknown.", button "DISCOVER THE ARMOR", image `https://cdn.jiro.build/Header%20Section/Auren3d/auren2.png`.
6. **Final hero title (shown while videoTime ≥ 5s)** — same `.auren-hero-title` styling but overridden inline to right: 60px; left: auto; text-align: right. Words: "THE FINAL", "CHAPTER", "UNFOLDS" (each on its own line).
7. **Final hero description (videoTime ≥ 5s)** — same `.auren-hero-desc` styling overridden inline to left: 60px; right: auto. Text verbatim: "Witness the culmination of celestial engineering and ancient magic. The archive awaits your discovery."

## Assets
- Video: `https://cdn.jiro.build/Header%20Section/Auren3d/output.mp4`
- Card 1 image: `https://cdn.jiro.build/Header%20Section/Auren3d/auren1.png`
- Card 2 image: `https://cdn.jiro.build/Header%20Section/Auren3d/auren2.png`

## Animations
- **Scroll-scrub video** (signature effect): register ScrollTrigger and map scroll progress across the 500vh section to the video's currentTime, also storing it in state so overlays can appear/disappear at timestamps.
```tsx
st = ScrollTrigger.create({
  trigger: ".auren-header-section",
  start: "top top",
  end: "bottom bottom",
  scrub: 1.5,
  onUpdate: (self) => {
    if (video.duration) {
      const time = self.progress * video.duration;
      video.currentTime = time;
      setVideoTime(time);
    }
  },
});
```
Initialise only after the video's metadata is available (readyState >= 1 or on the "loadedmetadata" event) and kill the trigger on unmount.
- **Nav entrance**: fade + slide down, initial { opacity: 0, y: -20 } → { opacity: 1, y: 0 }, duration 0.8, ease "easeOut".
- **Menu dropdown**: AnimatePresence, initial/exit { opacity: 0, y: -10, scale: 0.95 } → animate { opacity: 1, y: 0, scale: 1 }, duration 0.2.
- **Per-character title reveal** (both titles): parent variant staggers children by 0.05 (initial title also delays children by 0.3); each character starts { opacity: 0, y: 50 } and animates to { opacity: 1, y: 0 } with duration 0.6 ease "easeOut". Each word is wrapped in an inline-block, overflow:hidden span so letters wipe up from below. Titles exit via AnimatePresence (initial title exits { opacity: 0, y: -50 } over 0.5s).
- **Description clip reveal**: initial { opacity: 0, clipPath: 'inset(100% 0 0 0)' } → animate { opacity: 1, clipPath: 'inset(0% 0 0 0)' }, duration 1, initial one delayed 0.8s, both ease "easeOut"; matching clip-path exit.
- **Cards overlay**: container initial { opacity: 0, y: 100 } → { opacity: 1, y: 0 }, exit { opacity: 0, y: -150 }, duration 0.6 ease "easeInOut"; each card additionally slides { y: 50, opacity: 0 } → { y: 0, opacity: 1 } with staggered delays 0.1 and 0.2, exit { y: -100, opacity: 0 }.
- All overlays are gated by videoTime windows: titles/desc #1 for time < 2.5, cards for 3 ≤ time ≤ 4, titles/desc #2 for time ≥ 5.

## Responsive behavior
- **≤1200px**: center nav gap shrinks to 5vw; cards gap 20px with 20px side padding; cards 450px wide, padding 24px, gap 20px; card image 180px.
- **≤1024px**: nav padding 30px 40px; hero title left 40px / font-size 70px; hero desc right 40px / bottom 60px / 18px; center nav hidden; dropdown right 40px top 50px; cards stack vertically centered, gap 20px, bottom 40px; cards full width (max 560px) height 280px; card image 240px.
- **≈768px**: nav padding 20px with center-aligned items; hero title and desc hidden (display none); video object-position 70% center; dropdown right 20px top 50px; cards become position relative with margin-top 100px, gap 16px, 16px side padding; each card full width, height auto, flex-direction column-reverse, padding 20px, gap 16px; card image full width height 180px; card title 28px; `.auren-br` forced-line-break spans hidden.

## Key design principles
- Editorial luxury aesthetic: serif Italiana display type against clean white, minimal chrome, generous negative space.
- Cinematic scroll-scrubbing is the hero interaction — the video is a timeline, not autoplay.
- Content is choreographed to video timestamps, not scroll position directly.
- High-contrast black text on light video for legibility; frosted-glass dropdown for depth.
- Per-character mask reveals give the type a premium, deliberate entrance.

## Common mistakes to avoid
- Do NOT autoplay the video — keep it muted + playsInline and drive currentTime from ScrollTrigger.
- Do NOT register ScrollTrigger at module top level without a window guard in an SSR/Next.js environment.
- Do NOT forget the 500vh root height + sticky inner wrapper; without both, there is no scroll runway and the video won't scrub.
- Keep every AnimatePresence child keyed so exit animations fire correctly.
- Initialise the ScrollTrigger only after video metadata loads, and kill it on unmount to avoid leaks.

## Page title
AUREN — Rise of the Astral Guardman

## Integration (build-safety — do not skip)
- Add this section as a **new** component file with a unique name. Don't edit or overwrite any existing file except to add its import and render it.
- Render it **after** all existing sections; keep every previously built section exactly as-is — never replace or remove them.
- If no project exists, create a minimal React + Tailwind app; if one exists, use it as-is — don't re-scaffold or change the Tailwind/build config or version.
- Keep it self-contained: scope its fonts and any resets to this section; never set global `body`/`html`/`*` styles or a global font.
- Install only the libraries this section names.
````

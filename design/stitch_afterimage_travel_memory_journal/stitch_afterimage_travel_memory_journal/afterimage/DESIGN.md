---
name: Afterimage
colors:
  surface: '#ffffff'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#594139'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8d7168'
  outline-variant: '#e1bfb5'
  surface-tint: '#ab3500'
  primary: '#ab3500'
  on-primary: '#ffffff'
  primary-container: '#ff6b35'
  on-primary-container: '#5f1900'
  inverse-primary: '#ffb59d'
  secondary: '#006687'
  on-secondary: '#ffffff'
  secondary-container: '#57cafe'
  on-secondary-container: '#00536f'
  tertiary: '#00677e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00a7cb'
  on-tertiary-container: '#003744'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#c1e8ff'
  secondary-fixed-dim: '#74d1ff'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d67'
  tertiary-fixed: '#b5ebff'
  tertiary-fixed-dim: '#59d5fb'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e60'
  background: '#f7f4ee'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  border: '#e8e2d8'
  text-muted: '#77736d'
  status-undeveloped: '#2a2a2a'
  status-developing: '#8a8578'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system for Afterimage is built on the concept of "The Patient Memory." It rejects the frantic pace of modern social media in favor of a refined, editorial experience akin to a high-end travel monograph. The brand personality is nostalgic, sophisticated, and evocative, designed to make the act of revisiting memories feel like a curated ritual.

The visual style is **Editorial Minimalism** with **Tactile/Scrapbook** accents. It utilizes generous whitespace, a warm-toned canvas, and sophisticated serif typography to frame user content. A unique "Developing" mechanic serves as the core visual metaphor: memories begin as ephemeral, blurred grayscale ghosts and gradually transition into sharp, vivid color, mimicking the slow magic of analog darkroom chemistry.

## Colors
The palette is rooted in a warm, "Cream White" foundation that provides a softer, more organic feel than clinical white. 

- **Primary CTA:** A warm, sun-drenched orange used sparingly for key actions and to signify a fully "developed" state.
- **Secondary Accent:** A bright sky blue for decorative elements and supportive links.
- **Ink Black:** Used for all primary typography to maintain high-contrast legibility against the cream background.
- **State Colors:** Muted charcoal and taupe are reserved for the "Undeveloped" and "Developing" stages, creating a clear visual progression toward the vibrant primary accent once a memory is complete.

## Typography
The typography system relies on a high-contrast pairing that mirrors traditional magazine layouts.

- **Headlines:** Use **Playfair Display**. Italic styles should be used frequently for emphasis or "accent words" within a sentence to evoke a literary, handwritten feel (e.g., "A summer in *Tuscany*").
- **Body & UI:** **Inter** provides a neutral, highly readable counterpoint to the expressive serif. 
- **Labels:** Small caps or increased letter spacing should be applied to labels to create clear hierarchy without needing heavy font weights.

## Layout & Spacing
This design system utilizes a **Fluid Grid** with wide, intentional margins to emphasize the "Photo as Protagonist" philosophy.

- **Mobile:** 2-column grid for gallery views with 20px outer margins.
- **Tablet:** 3-column grid for broader exploration.
- **Desktop:** 4-column grid with expanded 64px margins to mimic a physical book spread.

Spacing should prioritize vertical "breathability." Use `stack-lg` between major sections to prevent the UI from feeling cluttered. Alignment should occasionally be offset or asymmetrical in collage views to reinforce the scrapbook aesthetic.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and physical metaphors rather than intense shadows.

- **Shadows:** Use a single, very soft, warm-tinted shadow (`0 12px 30px rgba(35, 28, 20, 0.10)`) for cards to make them appear as if they are resting lightly on thick paper.
- **Washi Tape:** Decorative semi-transparent overlays (using `secondary_color_hex` at 30% opacity) should be used on the corners of photos in detailed views to simulate tape.
- **Developing Effect:** The transition from blur (8px) and grayscale (100%) to sharp, full-color is the primary indicator of "depth" in the user's journey.

## Shapes
The shape language is soft and approachable, echoing the rounded corners of vintage printed photographs.

- **Cards & Photos:** Use a consistent 24px radius (`rounded-xl`).
- **Interactive Elements:** Buttons and input fields follow the standard 8px radius (`rounded-md`) to maintain a distinction between "content" and "controls."
- **Map Markers:** Circular (pill-shaped) containing cropped images, transitioning from grayscale to color based on the development state.

## Components
- **Cards:** White surfaces with 24px rounded corners and a soft shadow. Photos within cards should fill the top half or the entire background, utilizing a grayscale/blur filter if the memory is not yet "developed."
- **Buttons:** Primary CTAs use the Warm Orange background with Ink Black text for maximum impact. Secondary buttons use a subtle border (`#e8e2d8`) with no fill.
- **Washi-Tape Accents:** Small, rectangular, semi-transparent overlays placed at slight angles on the top-right or top-left corners of images in "Detail" views.
- **Development Progress Bar:** A thin, elegant hairline loader using the Sky Blue accent, moving horizontally to indicate the time remaining until a memory is developed.
- **Badges:** Small, high-contrast pills for status. "Undeveloped" uses Ink Black; "Developing" uses Muted Taupe; "Developed" uses the Primary Warm Orange.
- **Input Fields:** Minimalist with a bottom-border only (`#e8e2d8`), using `body-md` typography to feel like a notebook entry.
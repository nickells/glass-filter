# Glass Filter Demo

A standalone HTML/JavaScript/React implementation of a glassmorphism effect using SVG filters.

## Usage

```bash
npm install
npm run dev
```

Then open your browser to the URL shown (usually `http://localhost:5173`).

The demo uses Vite for fast development with proper React and Leva modules.

## Features

- **Two draggable glass blocks** - Click and drag the glass blocks around the page
- **SVG backdrop filters** - Uses SVG filter effects including:
  - Gaussian blur
  - Displacement maps
  - Turbulence/noise
  - Color tinting
- **Leva control panel** - Beautiful real-time controls for each block (top-right corner):
  - **Clarity**: Adjust the blur amount
  - **X/Y Distortion**: Control noise distortion
  - **Dist. Amount**: Displacement scale
  - **Stripe Size**: Vertical stripe pattern size
  - **Tint Intensity**: How strong the color tint is
  - **Color Tint**: Choose a color overlay with color picker

## Technical Details

The glass effect is created using a combination of SVG filter primitives:
- `feGaussianBlur` for the frosted glass look
- `feTurbulence` for organic noise patterns
- `feDisplacementMap` for distortion effects
- `feTile` for repeating stripe patterns
- `feColorMatrix` for color tinting

The backdrop-filter CSS property applies these SVG filters to the content behind the glass blocks.

### Libraries

- **React 18** - Component framework
- **Leva** - Beautiful control panel for real-time parameter tweaking
- **Babel Standalone** - JSX transformation in the browser

## Browser Support

Works best in modern browsers with SVG filter support. Tested in:
- Chrome/Edge
- Firefox
- Safari


import { useRef, useEffect } from 'react';
import { useControls } from 'leva';
import './App.css';

// Helper function to convert hex to RGB values
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
};

// Draggable hook
const useDraggable = (ref) => {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let mousedown = false;
    let start = { x: 0, y: 0 };
    let end = { x: 0, y: 0 };
    let transform = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      mousedown = true;
      start = { x: e.pageX, y: e.pageY };
    };

    const handleMouseUp = () => {
      end = { x: transform.x, y: transform.y };
      mousedown = false;
    };

    const handleMouseMove = (e) => {
      if (!mousedown) return;
      const maxTop = 0 - node.offsetTop;
      transform = {
        x: e.pageX - start.x + end.x,
        y: Math.max(e.pageY - start.y + end.y, maxTop),
      };
      node.style.transform = `translate(${transform.x}px, ${transform.y}px)`;
    };

    node.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      node.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);
};

// Filter component
const Filter = ({
  blurStdDeviation,
  noiseBaseFrequency,
  noiseScale,
  stripeSize,
  colorTint,
  tintIntensity,
  id,
}) => {
  const rgb = hexToRgb(colorTint);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id={id} width="400" height="400">
          <feFlood
            x="0"
            y="0"
            width={stripeSize}
            height="100"
            floodColor="transparent"
            floodOpacity="1"
            result="trans"
          />
          <feFlood
            x={stripeSize}
            y="0"
            width={stripeSize}
            height="100"
            floodColor="#000000"
            floodOpacity="1"
            result="black"
          />
          <feComposite
            in="black"
            in2="trans"
            operator="over"
            result="feComposite-87e10764"
          />
          <feTile in="feComposite-87e10764" result="feTile-3d2bbecf" />
          <feGaussianBlur
            in="feTile-3d2bbecf"
            stdDeviation={blurStdDeviation}
            edgeMode="none"
            result="displace"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="displace"
            scale="23"
            xChannelSelector="A"
            yChannelSelector="A"
            result="glass"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feTurbulence
            result="noise"
            type="fractalNoise"
            baseFrequency={`${noiseBaseFrequency.x} ${noiseBaseFrequency.y}`}
            numOctaves="4"
            seed="6"
            stitchTiles="noStitch"
          />
          <feDisplacementMap
            in="blur"
            in2="noise"
            scale={noiseScale}
            result="noisy-src"
          />
          <feComposite
            in="noisy-src"
            in2="glass"
            operator="lighter"
            result="combined"
          />
          <feColorMatrix
            in="combined"
            type="matrix"
            values={`
              ${1 - tintIntensity + tintIntensity * rgb.r} 0 0 0 0
              0 ${1 - tintIntensity + tintIntensity * rgb.g} 0 0 0
              0 0 ${1 - tintIntensity + tintIntensity * rgb.b} 0 0
              0 0 0 1 0
            `}
            result="colored"
          />
          <feMergeNode in="colored" />
        </filter>
      </defs>
    </svg>
  );
};

// GlassBlock component
const GlassBlock = ({ id }) => {
  const draggableRef = useRef(null);
  useDraggable(draggableRef);

  const {
    blurStdDeviation,
    xDistortion,
    yDistortion,
    noiseScale,
    stripeSize,
    colorTint,
    tintIntensity,
  } = useControls(id, {
    blurStdDeviation: {
      value: 2,
      min: 1,
      max: 10,
      step: 0.1,
      label: 'clarity',
    },
    xDistortion: { value: 0.05, min: 0, max: 0.5, step: 0.01 },
    yDistortion: { value: 0.1, min: 0, max: 0.5, step: 0.001 },
    noiseScale: {
      value: 23,
      min: 0,
      max: 100,
      step: 1,
      label: 'dist. amt',
    },
    stripeSize: { value: 10, min: 1, max: 100, step: 1 },
    colorTint: {
      value: '#ffffff',
      label: 'Color Tint',
    },
    tintIntensity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      label: 'Tint Intensity',
    },
  });

  const rgb = hexToRgb(colorTint);
  const borderColor = `rgba(${rgb.r * 255}, ${rgb.g * 255}, ${rgb.b * 255}, 0.5)`;

  return (
    <>
      <Filter
        blurStdDeviation={blurStdDeviation}
        noiseBaseFrequency={{ x: xDistortion, y: yDistortion }}
        noiseScale={noiseScale}
        stripeSize={stripeSize}
        colorTint={colorTint}
        tintIntensity={tintIntensity}
        id={id}
      />
      <div
        ref={draggableRef}
        className="glass-block"
        style={{
          backdropFilter: `url(#${id})`,
          border: `2px solid ${borderColor}`,
        }}
      />
    </>
  );
};

// Main App component
function App() {
  return (
    <div className="page">
      <h1>Wow! It's a cat.</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <img
        className="cat-img"
        src="https://mcgeheeclinic.com/wp-content/uploads/2023/12/cat-whiskers.jpg"
        alt="Cat"
      />

      <GlassBlock id="glass-1" />
      <GlassBlock id="glass-2" />
    </div>
  );
}

export default App;


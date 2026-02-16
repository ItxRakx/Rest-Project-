import React from 'react';

interface DekhoLogoProps {
  height?: number;
  className?: string;
}

// Dekho Tech wordmark inspired by provided image: Electric Blue text on Dark Navy background
// Uses SVG text for simplicity; background is rounded to feel like a badge
const DekhoLogo: React.FC<DekhoLogoProps> = ({ height = 28, className }) => {
  const width = Math.round((height / 28) * 160); // scale width proportionally
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 28"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Dekho logo"
    >
      <defs>
        <linearGradient id="dk-electric" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2EC7FF" />
          <stop offset="100%" stopColor="#00A8FF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="160" height="28" rx="8" fill="#0B1D3A" />
      <text
        x="12"
        y="20"
        fontSize="16"
        fontWeight="600"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'"
        fill="url(#dk-electric)"
      >
        Dekho
      </text>
    </svg>
  );
};

export default DekhoLogo;
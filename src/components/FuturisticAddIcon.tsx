import React from 'react';
import Svg, { Rect } from 'react-native-svg';

type FuturisticAddIconProps = {
  size?: number;
  color?: string;
};

export default function FuturisticAddIcon({
  size = 26,
  color = '#FFFFFF',
}: FuturisticAddIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Vertical capsule */}
      <Rect x="12" y="4" width="8" height="24" rx="4" fill={color} />
      {/* Horizontal capsule */}
      <Rect x="4" y="12" width="24" height="8" rx="4" fill={color} />
    </Svg>
  );
}

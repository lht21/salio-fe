import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CheckListIconProps {
  width?: number;
  height?: number;
  color1?: string;
  color2?: string;
  strokeWidth?: number;
}

export default function CheckListIcon({ 
  width = 36, 
  height = 36, 
  color1 = "#B05200", 
  color2 = "#4A3218", 
  strokeWidth = 2.25 
}: CheckListIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none">
      <Path d="M16.5 9H31.5" stroke={color1} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <Path d="M16.5 18H31.5" stroke={color1} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <Path d="M16.5 27H31.5" stroke={color1} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <Path d="M4.5 11.0893C4.5 11.0893 6 12.067 6.75 13.5C6.75 13.5 9 7.875 12 6" stroke={color2} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M4.5 27.5894C4.5 27.5894 6 28.5671 6.75 30C6.75 30 9 24.375 12 22.5" stroke={color2} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}
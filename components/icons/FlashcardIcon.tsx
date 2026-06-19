import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FlashcardIconProps {
  width?: number;
  height?: number;
  color?: string;
  secondaryColor?: string;
}

export default function FlashcardIcon({ 
  width = 302, 
  height = 444, 
  color = "#AEDD40", 
  secondaryColor = "#6EAA00",
}: FlashcardIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 302 444" fill="none">
      <Path 
        d="M0 53C0 23.7289 23.7289 0 53 0H249C278.271 0 302 23.7289 302 53V363.212C302 387.256 285.814 408.288 262.572 414.445L164.572 440.405C155.677 442.761 146.323 442.761 137.428 440.405L39.4284 414.445C16.1859 408.288 0 387.256 0 363.212V53Z" 
        fill={color} 
      />
      <Path 
        d="M0 53C0 23.7289 23.7289 0 53 0H249C278.271 0 302 23.7289 302 53V72H0V53Z" 
        fill={secondaryColor} 
      />
    </Svg>
  );
}
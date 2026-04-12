import React from 'react';
import Svg, { Path, Defs, ClipPath, Image as SvgImage } from 'react-native-svg';

interface ShieldBackgroundProps {
  width: number;
  height: number;
  fillColor?: string; // Đổi thành optional (?)
  backgroundImage?: any; // Thêm prop hỗ trợ hình ảnh (require hoặc {uri})
}

export default function ShieldBackground({ 
  width, 
  height, 
  fillColor = '#FFF', 
  backgroundImage 
}: ShieldBackgroundProps) {
  
  // Tính toán tỷ lệ vát (khoảng 5% chiều cao)
  const dentY = height * 0.05; 
  const cornerRadius = 30; // Bo góc

  // Khuôn hình chiếc khiên
  const path = `
    M ${cornerRadius} ${dentY}
    Q 0 ${dentY} 0 ${dentY + cornerRadius}
    L 0 ${height - cornerRadius - dentY}
    Q 0 ${height - dentY} ${cornerRadius} ${height - dentY}
    L ${width / 2} ${height}
    L ${width - cornerRadius} ${height - dentY}
    Q ${width} ${height - dentY} ${width} ${height - cornerRadius - dentY}
    L ${width} ${dentY + cornerRadius}
    Q ${width} ${dentY} ${width - cornerRadius} ${dentY}
    L ${width / 2} 0
    Z
  `;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      
      {/* 1. Định nghĩa mặt nạ cắt (ClipPath) */}
      <Defs>
        <ClipPath id="shieldMask">
          <Path d={path} />
        </ClipPath>
      </Defs>

      {/* 2. Hiển thị Hình ảnh (Nếu có) hoặc Màu trơn (Nếu không có hình) */}
      {backgroundImage ? (
        <SvgImage
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice" // object-fit: cover (Cắt ảnh lấp đầy khung)
          href={backgroundImage}
          clipPath="url(#shieldMask)" // Áp dụng mặt nạ hình khiên
        />
      ) : (
        <Path d={path} fill={fillColor} />
      )}

      {/* 3. Luôn luôn vẽ Viền đen đè lên trên cùng để nét được sắc sảo */}
      <Path
        d={path}
        fill="none" // Không tô nền ở layer này, chỉ lấy viền
        stroke="#1E293B" 
        strokeWidth="8"
      />
    </Svg>
  );
}
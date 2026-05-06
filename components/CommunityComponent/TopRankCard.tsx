import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { StarIcon } from 'phosphor-react-native';
import Svg, { Path } from 'react-native-svg';

import { FontFamily } from '../../constants/GlobalStyles';

export default function TopRankCard({ item, rank }: { item: any, rank: number }) {
  const isTop1 = rank === 1;
  const isTop2 = rank === 2;

  // Thiết lập màu viền tĩnh: Top 1 (Vàng), Top 2 (Bạc), Top 3 (Đồng)
  const staticColor = isTop1 ? '#FFD700' : isTop2 ? '#E2E8F0' : '#F59E0B'; 

  return (
    <View style={[styles.userCard, {
      marginTop: isTop1 ? 0 : (isTop2 ? 30 : 40),
      height: isTop1 ? 210 : 180,
    }]}>
      <Svg
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        width="100%"
        height="100%"
        viewBox="-5 -5 137 207"
        preserveAspectRatio="none"
      >
        <Path
          d="M0 41.2951C0 27.8244 8.69948 15.8953 21.5257 11.7784L53.5998 1.48326C59.7153 -0.479689 66.2895 -0.494655 72.4138 1.44042L105.34 11.8438C118.234 15.918 127 27.8806 127 41.4034V156.622C127 170.677 117.544 182.974 103.96 186.583L71.0236 195.334C65.7671 196.731 60.2358 196.72 54.9849 195.303L22.9218 186.648C9.39613 182.998 0 170.729 0 156.719V41.2951Z"
          fill="#97EB8E"
          stroke={staticColor}
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        {/* 1. Top Section */}
        <View style={styles.ucTopSection}>
          <View style={styles.ucAvatarBg}>
            <Image 
              source={{ uri: item.avatar }} 
              style={[styles.ucAvatar, { width: isTop1 ? 54 : 46, height: isTop1 ? 54 : 46, borderRadius: isTop1 ? 27 : 23 }]} 
            />
          </View>
          <Text style={styles.ucUsername} numberOfLines={1}>{item.name}</Text>
        </View>
        
        {/* 2. Middle Section */}
        <View style={styles.ucMiddleSection}>
          <View style={styles.ucScoreBadge}>
            <Text style={styles.ucScoreText}>{item.score}</Text>
          </View>
        </View>

        {/* 3. Bottom Section */}
        <View style={styles.ucBottomSection}>
          <View style={styles.ucStarWrapper}>
            <StarIcon size={isTop1 ? 42 : 34} color="#1E1E1E" weight="fill" />
            <Text style={[styles.ucStarRankText, { fontSize: isTop1 ? 18 : 16, color: staticColor }]}>{rank}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: { flex: 1, alignItems: 'center', paddingHorizontal: 6, overflow: 'visible' },
  ucTopSection: { alignItems: 'center' },
  ucAvatarBg: { backgroundColor: '#6C63FF', borderRadius: 35, padding: 3, marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  ucAvatar: { borderWidth: 2, borderColor: '#FFFFFF' },
  ucUsername: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 12, color: '#1E1E1E', textAlign: 'center' },
  ucMiddleSection: { alignItems: 'center', marginVertical: 4 },
  ucScoreBadge: { backgroundColor: '#F4A261', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15 },
  ucScoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: 12, color: '#FFFFFF' },
  ucBottomSection: { alignItems: 'center' },
  ucStarWrapper: { alignItems: 'center', justifyContent: 'center' },
  ucStarRankText: { position: 'absolute', fontFamily: FontFamily.lexendDecaBold, color: '#FFFFFF' },
});
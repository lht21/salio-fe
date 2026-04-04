import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { GearSixIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';
import StatusBadge from './StatusBadge';

const ProfileHeader = () => {
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#CEF9B4', '#E6FEE6', Color.bg]}
        style={styles.gradientBg}
      />
      
      {/* Settings Icon */}
      <TouchableOpacity style={styles.settingsBtn}>
        <View style={styles.settingsIconBg}>
          <GearSixIcon size={24} color={Color.gray} weight="fill" />
        </View>
      </TouchableOpacity>

      {/* Avatar & Info */}
      <View style={styles.infoWrapper}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }} // Placeholder Avatar
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <Text style={styles.username}>tranlehuy</Text>
        <StatusBadge text="Trình độ học Sơ cấp 2" bgColor={Color.vang || '#F9F871'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 0,
  },
  settingsBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  settingsIconBg: {
    backgroundColor: Color.stroke,
    padding: 8,
    borderRadius: 20,
  },
  infoWrapper: {
    alignItems: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Color.xanh || '#1877F2',
    borderWidth: 4,
    borderColor: Color.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
    // Outer green border effect
    shadowColor: Color.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 102,
    height: 102,
    borderRadius: 51,
  },
  username: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text || '#1E1E1E',
    marginBottom: Gap.gap_10,
  },
});

export default ProfileHeader;
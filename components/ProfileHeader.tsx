import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { GearSixIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';
import StatusBadge from './StatusBadge';
import { useRouter } from 'expo-router';

const ProfileHeader = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View
        
        style={styles.gradientBg}
      />
      
      {/* Settings Icon */}
      <TouchableOpacity style={styles.settingsBtn}
      onPress={() => router.push('/settings')}>
        <View style={styles.settingsIconBg}>
          <GearSixIcon size={24} color={Color.bg} weight="fill" />
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
        <StatusBadge text="Trình độ học Sơ cấp 1" bgColor={Color.vang || '#F9F871'} />
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
    height: 120,
    zIndex: 0,
    backgroundColor: Color.main || '#98F291',
  },
  settingsBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  settingsIconBg: {
    backgroundColor: Color.gray,
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
    backgroundColor: Color.bg || '#1877F2',
    borderWidth: 3,
    borderColor: Color.main,
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
    width: 100,
    height: 100,
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
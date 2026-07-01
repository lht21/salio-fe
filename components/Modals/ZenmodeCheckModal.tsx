import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { MicrophoneIcon, BellSlashIcon, WarningCircleIcon, CheckCircleIcon } from 'phosphor-react-native';

import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import Button from '../Button';
import IconButton from '../IconButton';
import { XIcon } from 'phosphor-react-native';
import { useTheme } from "@/contexts/ThemeContext";

interface ZenmodeCheckModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ZenmodeCheckModal({ isVisible, onClose, onConfirm }: ZenmodeCheckModalProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [micStatus, setMicStatus] = useState<'checking' | 'quiet' | 'loud' | 'error'>('checking');
  const [dndChecked, setDndChecked] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    if (isVisible) {
      setMicStatus('checking');
      setDndChecked(false);
      startNoiseCheck();
    } else {
      stopNoiseCheck();
    }
    return () => { stopNoiseCheck(); };
  }, [isVisible]);

  const startNoiseCheck = async () => {
    try {
      // Xin quyền sử dụng Micro
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== 'granted') {
        setMicStatus('error');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.LOW_QUALITY,
        isMeteringEnabled: true, // Bật tính năng đo cường độ âm thanh
      });

      let maxDb = -160;
      let checkCount = 0;

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.metering !== undefined) {
          if (status.metering > maxDb) maxDb = status.metering;
          checkCount++;

          // Đo trong khoảng 2.5 giây (khoảng 5 lần lấy mẫu)
          if (checkCount > 5) {
            stopNoiseCheck();
            // -10 dB là ngưỡng tương đối ồn đối với micro điện thoại
            if (maxDb > -10) {
              setMicStatus('loud');
            } else {
              setMicStatus('quiet');
            }
          }
        }
      });

      await recording.startAsync();
      recordingRef.current = recording;
    } catch (err) {
      console.log('Lỗi kiểm tra tiếng ồn:', err);
      setMicStatus('error');
    }
  };

  const stopNoiseCheck = async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (err) { }
      recordingRef.current = null;
    }
  };

  const handleComplete = () => {
    stopNoiseCheck();
    onConfirm();
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Chuẩn bị vào Zenmode</Text>
            <IconButton Icon={XIcon} onPress={onClose} />
          </View>

          {/* CHECK 1: TIẾNG ỒN MÔI TRƯỜNG */}
          <View style={styles.checkItem}>
            <View style={styles.iconBox}>
              <MicrophoneIcon size={24} color={colors.purple || '#8B5CF6'} weight="fill" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Đo tiếng ồn môi trường</Text>
              {micStatus === 'checking' && (
                <View style={styles.statusRow}>
                  <ActivityIndicator size="small" color={colors.purple || '#8B5CF6'} />
                  <Text style={styles.statusText}>Đang phân tích...</Text>
                </View>
              )}
              {micStatus === 'quiet' && (
                <View style={styles.statusRow}>
                  <CheckCircleIcon size={16} color={colors.primary || '#22C55E'} weight="fill" />
                  <Text style={[styles.statusText, { color: colors.primary || '#22C55E' }]}>Khá yên tĩnh, tuyệt vời!</Text>
                </View>
              )}
              {micStatus === 'loud' && (
                <View style={styles.statusRow}>
                  <WarningCircleIcon size={16} color={colors.cam || '#F59E0B'} weight="fill" />
                  <Text style={[styles.statusText, { color: colors.cam || '#F59E0B' }]}>Môi trường đang hơi ồn ào.</Text>
                </View>
              )}
              {micStatus === 'error' && (
                <Text style={styles.statusText}>Chưa cấp quyền Micro.</Text>
              )}
            </View>
          </View>

          {/* CHECK 2: CHẶN THÔNG BÁO (MANUAL) */}
          <TouchableOpacity style={styles.checkItem} onPress={() => setDndChecked(!dndChecked)} activeOpacity={0.8}>
            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
              <BellSlashIcon size={24} color="#EF4444" weight="fill" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Chặn thông báo</Text>
              <Text style={styles.itemDesc}>Hãy tự bật chế độ Không làm phiền (Do Not Disturb) trên điện thoại để không bị gián đoạn.</Text>
            </View>
            <View style={[styles.checkbox, dndChecked && styles.checkboxChecked]}>
              {dndChecked && <CheckCircleIcon size={20} color="#FFFFFF" weight="bold" />}
            </View>
          </TouchableOpacity>

          <Button
            title="Xác nhận, bắt đầu làm bài"
            variant="Green"
            onPress={handleComplete}
            disabled={micStatus === 'checking' || !dndChecked}
            style={{ marginTop: Gap.gap_20, opacity: (micStatus === 'checking' || !dndChecked) ? 0.6 : 1 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Padding.padding_15 },
  modalContainer: { width: '100%', backgroundColor: colors.background || '#FFFFFF', borderRadius: Border.br_20, padding: Padding.padding_20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  title: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.textPrimary },
  checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderDefault || '#E2E8F0' },
  iconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.purplePastel || '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemContent: { flex: 1 },
  itemTitle: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textPrimary, marginBottom: 4 },
  itemDesc: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: colors.textSecondary, lineHeight: 18 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: colors.textSecondary },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.borderDefault || '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  checkboxChecked: { backgroundColor: colors.primary || '#22C55E', borderColor: colors.primary || '#22C55E' },
});
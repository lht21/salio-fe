import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { CheckCircleIcon, XCircleIcon } from 'phosphor-react-native';

import { FontFamily, FontSize, Color } from '../../constants/GlobalStyles';
import Button from '../Button';

export type ImmediateFeedbackBarProps = {
  visible: boolean;
  isCorrect: boolean;
  onNext: () => void;
};

export default function ImmediateFeedbackBar({
  visible,
  isCorrect,
  onNext,
}: ImmediateFeedbackBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{ translateX: 500 }}
          animate={{ translateX: 0 }}
          exit={{ translateX: 500 }}
          transition={{ type: 'timing', duration: 300 } as any}
          style={[
            styles.container,
            isCorrect ? styles.containerCorrect : styles.containerIncorrect,
          ]}
        >
          <View style={styles.messageRow}>
            {isCorrect ? (
              <CheckCircleIcon size={28} color="#2F7D1F" weight="fill" />
            ) : (
              <XCircleIcon size={28} color="#8B1B00" weight="fill" />
            )}
            <Text
              style={[
                styles.messageText,
                isCorrect ? styles.textCorrect : styles.textIncorrect,
              ]}
            >
              {isCorrect ? 'Tuyệt vời, chính xác!' : 'Rất tiếc, sai rồi!'}
            </Text>
          </View>

          <Button
            title="Tiếp tục"
            variant={isCorrect ? "Green" : "Red"}
            onPress={onNext}
            style={styles.button}
          />
        </MotiView>
      )}
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30, // Safe area padding
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerCorrect: {
    backgroundColor: '#E8F8E3',
  },
  containerIncorrect: {
    backgroundColor: '#FFECEC',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  messageText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
  },
  textCorrect: {
    color: '#2F7D1F',
  },
  textIncorrect: {
    color: '#8B1B00',
  },
  button: {
    marginVertical: 0,
    minWidth: 120,
  },
});

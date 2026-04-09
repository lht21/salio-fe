import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { AnimatePresence, MotiView } from 'moti';
import { ArrowRightIcon, XIcon } from 'phosphor-react-native';

import Button, { ButtonVariant } from './Button';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';

type LessonIntroTemplateProps = {
  imageSource: any;
  heading: string;
  description: string;
  accentText?: string;
  buttonVariant?: ButtonVariant;
  leftMetaText?: string;
  rightMetaText?: string;
  nextPath: (lessonId: string) => string;
};

const LessonIntroTemplate = ({
  imageSource,
  heading,
  description,
  accentText,
  buttonVariant = 'Green',
  leftMetaText,
  rightMetaText,
  nextPath,
}: LessonIntroTemplateProps) => {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable  onPress={() => router.back()}>
            <XIcon size={24} color={Color.colorSeagreen} weight="bold" />
          </Pressable>
        </View>

        <AnimatePresence>
          <MotiView
            from={{ opacity: 0, translateY: 18 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 360 }}
            style={styles.content}
          >
            <Image source={imageSource} style={styles.heroImage} contentFit="cover" />

            {accentText ? <Text style={styles.accentText}>{accentText}</Text> : null}

            {leftMetaText || rightMetaText ? (
              <View style={styles.metaRow}>
                <Text style={styles.roundText}>{leftMetaText ?? ''}</Text>
                <Text style={styles.modeText}>{rightMetaText ?? ''}</Text>
              </View>
            ) : null}

            <View style={styles.descriptionBox}>
              <Text style={styles.description}>{description}</Text>
            </View>

            <View style={styles.buttonWrap}>
              <Button
                title="Bắt đầu"
                variant={buttonVariant}
                onPress={() => router.push(nextPath(resolvedLessonId) as any)}
                style={styles.startButton}
              />

              <View style={styles.buttonIcon}>
                <ArrowRightIcon size={18} color={Color.text} weight="bold" />
              </View>
            </View>
          </MotiView>
        </AnimatePresence>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4A4A4A',
  },
  screen: {
    flex: 1,
    backgroundColor: Color.bg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop:20,
    paddingBottom: 18,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Color.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: Gap.gap_20,
  },
  heroImage: {
    width: 180,
    height: 180,
    borderRadius: 32,
    top: 20,
  },
  accentText: {
    marginTop: 10,
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.cam,
    textAlign: 'center',
  },
  metaRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginTop: 40,
  },
  roundText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
  },
  modeText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.cam,
  },
  descriptionBox: {
    width: '100%',
    minHeight: 100,
    borderRadius: Border.br_15,
    borderWidth: 2,
    borderColor: '#AEFF66',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    top: 60,
  },
  description: {
    textAlign: 'center',
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    lineHeight: 24,
  },
  buttonWrap: {
    width: '100%',
    marginTop: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  startButton: {
    marginVertical: 0,
    paddingRight: 50,
    top: 150,
  },
  buttonIcon: {
    position: 'absolute',
    right: 26,
    top: 175,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LessonIntroTemplate;

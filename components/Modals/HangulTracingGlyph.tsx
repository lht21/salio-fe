import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Color } from '../../constants/GlobalStyles';
import { HANGUL_STROKE_DATA } from './hangulStrokeData';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type AnimatedStrokeProps = {
  d: string;
  delay: number;
  strokeWidth: number;
  baseDelayMs: number;
};

const AnimatedStroke = ({ d, delay, strokeWidth, baseDelayMs }: AnimatedStrokeProps) => {
  const pathRef = React.useRef<Path>(null);
  const [pathLength, setPathLength] = React.useState(0);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const measuredLength = pathRef.current?.getTotalLength?.() ?? 0;
      if (measuredLength > 0) {
        setPathLength(measuredLength);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [d]);

  React.useEffect(() => {
    if (!pathLength) {
      return;
    }

    progress.value = 0;
    progress.value = withDelay(
      baseDelayMs + delay,
      withTiming(1, {
        duration: 560,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      })
    );
  }, [baseDelayMs, delay, pathLength, progress]);

  const animatedProps = useAnimatedProps(() => ({
    opacity: pathLength > 0 ? 1 : 0,
    strokeDashoffset: pathLength * (1 - progress.value),
  }));

  if (!pathLength) {
    return (
      <Path
        ref={pathRef}
        d={d}
        stroke="transparent"
        strokeWidth={strokeWidth}
        fill="none"
      />
    );
  }

  return (
    <>
      <AnimatedPath
        ref={pathRef}
        d={d}
        animatedProps={animatedProps}
        strokeDasharray={pathLength}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth={strokeWidth + 6}
        fill="none"
      />
      <AnimatedPath
        d={d}
        animatedProps={animatedProps}
        strokeDasharray={pathLength}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={Color.colorBlack}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </>
  );
};

type HangulTracingGlyphProps = {
  glyph: string;
  baseDelayMs?: number;
};

const HangulTracingGlyph = ({ glyph, baseDelayMs = 1000 }: HangulTracingGlyphProps) => {
  const glyphData = HANGUL_STROKE_DATA[glyph];

  if (!glyphData) {
    return (
      <View style={styles.fallbackWrap}>
        <Text style={styles.fallbackText}>{glyph}</Text>
      </View>
    );
  }

  const strokeWidth = glyphData.strokeWidth ?? 13;

  return (
    <View style={styles.wrapper}>
      <Svg width={220} height={220} viewBox="0 0 120 120">
        {glyphData.strokes.map((stroke, index) => (
          <Path
            key={`base-${index}`}
            d={stroke}
            stroke="#CFCFCF"
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}

        {glyphData.strokes.map((stroke, index) => (
          <AnimatedStroke
            key={`ink-${index}`}
            d={stroke}
            delay={index * 320}
            strokeWidth={strokeWidth}
            baseDelayMs={baseDelayMs}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 156,
    lineHeight: 170,
    color: Color.colorBlack,
  },
});

export default HangulTracingGlyph;
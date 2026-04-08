import React from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Border, Color } from '../../constants/GlobalStyles';
import { HANGUL_STROKE_DATA } from './hangulStrokeData';

type HangulPracticeCanvasProps = {
  glyph: string;
  resetToken: number;
};

type StrokePath = {
  id: string;
  d: string;
};

const VIEWBOX_SIZE = 120;

const HangulPracticeCanvas = ({ glyph, resetToken }: HangulPracticeCanvasProps) => {
  const [paths, setPaths] = React.useState<StrokePath[]>([]);
  const [currentPath, setCurrentPath] = React.useState('');
  const [canvasSize, setCanvasSize] = React.useState({ width: 1, height: 1 });
  const currentPathRef = React.useRef('');
  const strokeIdRef = React.useRef(0);
  const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    setPaths([]);
    setCurrentPath('');
    currentPathRef.current = '';
    lastPointRef.current = null;
  }, [resetToken, glyph]);

  const toViewBoxPoint = React.useCallback(
    (x: number, y: number) => ({
      x: Number(((x / Math.max(canvasSize.width, 1)) * VIEWBOX_SIZE).toFixed(2)),
      y: Number(((y / Math.max(canvasSize.height, 1)) * VIEWBOX_SIZE).toFixed(2)),
    }),
    [canvasSize.height, canvasSize.width]
  );

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasSize({
      width: Math.max(width, 1),
      height: Math.max(height, 1),
    });
  }, []);

  const commitCurrentPath = React.useCallback((releaseX?: number, releaseY?: number) => {
    let finalizedPath = currentPathRef.current;

    if (typeof releaseX === 'number' && typeof releaseY === 'number') {
      const point = toViewBoxPoint(releaseX, releaseY);
      const lastPoint = lastPointRef.current;

      if (!lastPoint || lastPoint.x !== point.x || lastPoint.y !== point.y) {
        finalizedPath = `${finalizedPath} L ${point.x} ${point.y}`;
      }
    }

    if (!finalizedPath) {
      currentPathRef.current = '';
      lastPointRef.current = null;
      setCurrentPath('');
      return;
    }

    setPaths((existing) => [
      ...existing,
      {
        id: `stroke-${strokeIdRef.current++}`,
        d: finalizedPath,
      },
    ]);
    currentPathRef.current = '';
    lastPointRef.current = null;
    setCurrentPath('');
  }, [toViewBoxPoint]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => {
          const point = toViewBoxPoint(event.nativeEvent.locationX, event.nativeEvent.locationY);
          const path = `M ${point.x} ${point.y}`;
          currentPathRef.current = path;
          lastPointRef.current = point;
          setCurrentPath(path);
        },
        onPanResponderMove: (event) => {
          const point = toViewBoxPoint(event.nativeEvent.locationX, event.nativeEvent.locationY);
          currentPathRef.current = `${currentPathRef.current} L ${point.x} ${point.y}`;
          lastPointRef.current = point;
          setCurrentPath(currentPathRef.current);
        },
        onPanResponderRelease: (event) =>
          commitCurrentPath(event.nativeEvent.locationX, event.nativeEvent.locationY),
        onPanResponderTerminate: (event) =>
          commitCurrentPath(event.nativeEvent.locationX, event.nativeEvent.locationY),
      }),
    [commitCurrentPath, toViewBoxPoint]
  );

  const guide = HANGUL_STROKE_DATA[glyph];

  return (
    <View style={styles.canvasWrap} onLayout={handleLayout} {...panResponder.panHandlers}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} preserveAspectRatio="xMidYMid meet">
        {guide?.strokes.map((stroke, index) => (
          <Path
            key={`guide-${index}`}
            d={stroke}
            stroke="rgba(100, 116, 139, 0.22)"
            strokeWidth={(guide.strokeWidth ?? 13) - 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}

        {paths.map((path) => (
          <Path
            key={path.id}
            d={path.d}
            stroke={Color.colorBlack}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}

        {currentPath ? (
          <Path
            d={currentPath}
            stroke={Color.colorBlack}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : null}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  canvasWrap: {
    flex: 1,
    margin: 14,
    borderRadius: Border.br_20,
    backgroundColor: '#F8F8F8',
    overflow: 'hidden',
  },
});

export default HangulPracticeCanvas;

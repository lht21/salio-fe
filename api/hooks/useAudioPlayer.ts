import { useState, useEffect, useRef } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

export default function useAudioPlayer(audioSource?: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (!audioSource) return;
    const setup = async () => {
      try {
        if (audioRef.current) await audioRef.current.unloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioSource },
          { shouldPlay: false, rate: selectedSpeed, shouldCorrectPitch: true },
          (status) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
              setDurationMs(status.durationMillis ?? 0);
              setPositionMs(status.positionMillis ?? 0);
              setPlaybackProgress(status.durationMillis ? status.positionMillis / status.durationMillis : 0);

              if (status.didJustFinish) {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.setPositionAsync(0);
              }
            }
          }
        );
        audioRef.current = sound;
        setAudioReady(true);
      } catch (err) {
        console.error("Audio error:", err);
      }
    };
    setup();
    return () => {
      if (audioRef.current) audioRef.current.unloadAsync();
    };
  }, [audioSource]);

  const togglePlayPause = async () => {
    if (!audioRef.current || !audioReady) return;
    if (isPlaying) {
      await audioRef.current.pauseAsync();
    } else if (durationMs > 0 && positionMs >= durationMs) {
      await audioRef.current.replayAsync();
    } else {
      await audioRef.current.playAsync();
    }
  };

  const setSpeed = async (val: number) => {
    setSelectedSpeed(val);
    if (audioRef.current) {
      await audioRef.current.setRateAsync(val, true);
    }
  };

  const rewind = async () => {
    if (!audioRef.current || durationMs === 0) return;
    const newPosition = Math.max(0, positionMs - 10000);
    await audioRef.current.setPositionAsync(newPosition);
  };

  const forward = async () => {
    if (!audioRef.current || durationMs === 0) return;
    const newPosition = Math.min(durationMs, positionMs + 10000);
    await audioRef.current.setPositionAsync(newPosition);
  };

  const seek = async (newProgress: number) => {
    if (audioRef.current && durationMs > 0) {
      const newPosition = newProgress * durationMs;
      await audioRef.current.setPositionAsync(newPosition);
    }
  };

  return {
    isPlaying,
    playbackProgress,
    durationMs,
    positionMs,
    selectedSpeed,
    audioReady,
    togglePlayPause,
    setSpeed,
    rewind,
    forward,
    seek,
  };
}

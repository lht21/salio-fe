import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PracticeService from '../../../../../api/services/practice.service';
import ExamResultUI from '../../../../../components/PracticeComponent/ExamResultUI';
import WritingResultUI from '../../../../../components/PracticeComponent/WritingResultUI';
import { Color } from '../../../../../constants/GlobalStyles';

export default function PracticeResultScreen() {
  const { type, setId, attemptId } = useLocalSearchParams();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        if (attemptId) {
          const response = await PracticeService.getAttemptResult(attemptId as string);
          // Bóc tách data từ AttemptResultResponse wrapper
          if (response && response.data) {
            setResultData(response.data);
          } else {
            setResultData(response);
          }
        }
      } catch (error) {
        console.error('Failed to fetch attempt result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  const handleHomePress = () => {
    router.replace(`/practice/${type}` as any);
  };

  const handleReviewPress = () => {
    router.push(`/practice/${type}/${setId}/${attemptId}/review` as any);
  };

  const handleRetryPress = () => {
    // Chuyển hướng người dùng lại màn thi trước đó
    router.replace(`/practice/${type}/${setId}/intro` as any);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.color} />
      </View>
    );
  }

  if (type === 'writing') {
    return <WritingResultUI data={resultData} onHomePress={handleHomePress} onRetryPress={handleRetryPress} />;
  }

  return (
    <ExamResultUI 
      type={type as string} 
      data={resultData} 
      onHomePress={handleHomePress} 
      onReviewPress={handleReviewPress} 
      onRetryPress={handleRetryPress} 
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.bg }
});
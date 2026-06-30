import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Import Design System & Components
import MultipleChoiceUI from '../../../../../components/PracticeComponent/MultipleChoiceUI';
import WritingUI from '../../../../../components/PracticeComponent/WritingUI';
import PracticeService from '../../../../../api/services/practice.service';
import { PracticeType } from '../../../../../api/types/practice.types';
import { useTheme } from "@/contexts/ThemeContext";

// ============================================================================
// CONTAINER: LOGIC DATA & STATE MANAGEMENT
// ============================================================================

export default function PracticeExamContainer() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { type, setId, attemptId } = useLocalSearchParams();
  const typeString = (type as string) || 'full';
  const isWriting = typeString === 'writing';

  const [examData, setExamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho bài làm
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [writingText, setWritingText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const totalTimeRef = useRef<number>(0);
  
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch đề thi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch đồng thời Đề thi và Trạng thái làm bài
        const [setRes, statusRes] = await Promise.all([
          PracticeService.getSetById(typeString as PracticeType, setId as string),
          PracticeService.getAttemptStatus(attemptId as string).catch(err => {
            console.error('Lỗi lấy trạng thái bài làm:', err);
            return null; // Bắt lỗi riêng để không block việc lấy đề
          })
        ]);

        if (setRes && setRes.success) {
          setExamData(setRes.data);
          
          // Set thời gian làm bài (Viết dùng timeLimit(giây), Trắc nghiệm dùng duration(phút))
          const durationInSeconds = isWriting ? (setRes.data?.timeLimit || 0) : ((setRes.data?.duration || 0) * 60);
          const initialTime = durationInSeconds || 50 * 60;
          totalTimeRef.current = initialTime;
          
          let currentTimeLeft = initialTime;

          if (statusRes && statusRes.success && statusRes.data) {
            const statusData = statusRes.data as any;

            // 4. Phục hồi thời gian
            if (statusData.timeSpent && statusData.timeSpent > 0) {
              currentTimeLeft = Math.max(0, initialTime - statusData.timeSpent);
            }

            // 2. Phục hồi bài viết
            if (isWriting) {
              if (statusData.content) {
                setWritingText(statusData.content);
              }
            } 
            // 3. Phục hồi trắc nghiệm
            else {
              const restoredAnswers: Record<string, string> = {};
              
              if (Array.isArray(statusData.readingAnswers)) {
                statusData.readingAnswers.forEach((ans: any) => {
                  if (ans.questionId && ans.userAnswer) {
                    restoredAnswers[ans.questionId] = ans.userAnswer;
                  }
                });
              }

              if (Array.isArray(statusData.listeningAnswers)) {
                statusData.listeningAnswers.forEach((ans: any) => {
                  if (ans.questionId && ans.userAnswer) {
                    restoredAnswers[ans.questionId] = ans.userAnswer;
                  }
                });
              }
              
              setAnswers(restoredAnswers);
            }
          }

          setTimeLeft(currentTimeLeft);
        } else {
          Alert.alert('Lỗi', 'Không thể tải đề thi');
        }
      } catch (error) {
        console.error('Lỗi lấy đề:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [typeString, setId, attemptId, isWriting]);

  // Countdown Timer
  useEffect(() => {
    if (isLoading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading]);

  // Handle Lưu bài
  const handleSaveAnswer = (questionId: string | null, answerValue: string, sectionType?: string) => {
    const timeSpent = totalTimeRef.current > 0 ? totalTimeRef.current - timeLeft : 0;

    // Tự động suy luận type dựa trên examData nếu không được truyền vào
    let derivedType = sectionType || typeString;
    
    if (isWriting) {
      derivedType = 'writing';
    } else if (typeString === 'full' && !sectionType && questionId && examData?.items) {
      const isListening = examData.items.listening?.some((item: any) => 
        item.questions?.some((q: any) => q._id === questionId || q.id === questionId)
      );
      const isReading = examData.items.reading?.some((item: any) => 
        item.questions?.some((q: any) => q._id === questionId || q.id === questionId)
      );

      if (isListening) derivedType = 'listening';
      else if (isReading) derivedType = 'reading';
    }

    const payload = {
      type: derivedType as PracticeType,
      questionId: questionId || undefined,
      answer: answerValue,
      timeSpent
    };

    if (isWriting) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        PracticeService.saveAnswer(attemptId as string, payload).catch(error => {
          console.log('Lỗi Auto-save Writing:', error);
        });
      }, 2000);
    } else {
      PracticeService.saveAnswer(attemptId as string, payload).catch(error => {
        console.log('Lỗi Save Trắc nghiệm:', error);
      });
    }
  };

  const onSelectMultipleChoice = (questionId: string, answerId: string, sectionType?: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    handleSaveAnswer(questionId, answerId, sectionType);
  };

  const onChangeWritingText = (text: string) => {
    setWritingText(text);
    handleSaveAnswer(null, text, 'writing');
  };

  const handleSubmit = async () => {
    try {
      // Đảm bảo đẩy đáp án cuối cùng lên trước khi nộp
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      const timeSpent = totalTimeRef.current > 0 ? totalTimeRef.current - timeLeft : 0;

      if (isWriting) {
        try {
          await PracticeService.saveAnswer(attemptId as string, {
            type: 'writing' as PracticeType,
            questionId: undefined,
            answer: writingText,
            timeSpent
          });
        } catch (saveError) {
          console.log('Lỗi lưu bài viết trước khi nộp:', saveError);
        }
      }

      const res = await PracticeService.submitAttempt(attemptId as string, timeSpent);
      if (res.success) {
        router.replace(`/practice/${typeString}/${setId}/${attemptId}/result` as any);
      } else {
        Alert.alert('Lỗi nộp bài', res.message);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể nộp bài');
    }
  };

  const handleExit = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.main} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {isWriting ? (
        <WritingUI 
          data={examData}
          text={writingText}
          timeLeft={timeLeft}
          onChangeText={onChangeWritingText}
          onSubmit={handleSubmit}
          onExit={handleExit}
        />
      ) : (
        <MultipleChoiceUI 
          type={typeString}
          data={examData}
          answers={answers}
          timeLeft={timeLeft}
          onSelectAnswer={onSelectMultipleChoice}
          onSubmit={handleSubmit}
          onExit={handleExit}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      safeArea: { flex: 1, backgroundColor: colors.bg }
    });
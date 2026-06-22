import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import ExplanationScreen from '@/components/LessonReview/ExplanationScreen';
import LessonService from '../../../../api/services/lesson.service';
import { Color } from '../../../../constants/GlobalStyles';

export default function FinalTestExplanationScreen() {
  const router = useRouter();
  const { lessonId, sessionId } = useLocalSearchParams<{ lessonId: string, sessionId: string }>();
  const [explanationData, setExplanationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function để xử lý hiển thị đáp án đúng (có thể là array)
  const formatCorrectAnswer = (correctAnswer: any) => {
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.join(', ');
    }
    return String(correctAnswer);
  };

  // Helper function để kiểm tra và format đáp án của user
  const formatUserAnswer = (userAnswer: any, isCorrect: boolean, correctAnswer: any) => {
    if (!userAnswer || userAnswer === '') {
      return '(Không có câu trả lời)';
    }
    
    // Nếu là array thì join lại
    if (Array.isArray(userAnswer)) {
      return userAnswer.join(', ');
    }
    
    return String(userAnswer);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await LessonService.getFinalTestResult(lessonId, sessionId);
        const { quiz, session } = data.data;

        // Flatten quiz để tìm thông tin câu hỏi gốc
        const allQuestions: any[] = [];
        ['listening', 'reading', 'writing', 'speaking'].forEach(sec => {
          // @ts-ignore
          quiz.sections?.[sec]?.forEach((item: any) => {
            item.questions?.forEach((q: any) => allQuestions.push(q));
          });
        });

        // Map đáp án của user với câu hỏi gốc
        const formatted = session.answers.map((ans: any, idx: number) => {
          const original = allQuestions.find(q => q._id === ans.questionId);
          const correctAnswerFormatted = formatCorrectAnswer(original?.correctAnswer);
          const userAnswerFormatted = formatUserAnswer(ans.userAnswer, ans.isCorrect, original?.correctAnswer);
          
          // Tạo mảng answers với style riêng cho từng đáp án
          const answers = [
            { 
              label: `Bạn đã chọn: ${userAnswerFormatted}`, 
              state: ans.isCorrect ? 'correct' : 'wrong'  // 'correct' hoặc 'wrong' để tô màu
            },
            { 
              label: `Đáp án đúng: ${correctAnswerFormatted}`, 
              state: 'correct'  // Luôn là 'correct' để tô xanh
            }
          ];

          // Nếu câu sai, thêm giải thích chi tiết
          let explanationBody = original?.explanation || "Hãy ôn tập lại kiến thức trong bài học này.";
          if (!ans.isCorrect && original?.correctAnswer) {
            explanationBody = `${explanationBody}\n\nGợi ý: Đáp án đúng là "${correctAnswerFormatted}".`;
          }

          return {
            id: ans.questionId,
            indexLabel: `Câu ${idx + 1}`,
            question: original?.questionText || "Câu hỏi Mini Test",
            answers: answers,
            explanation: {
              title: ans.isCorrect ? "Câu trả lời chính xác" : "Câu trả lời sai",
              correctLabel: correctAnswerFormatted,
              body: explanationBody,
              userAnswer: userAnswerFormatted,
              isCorrect: ans.isCorrect
            }
          };
        });

        setExplanationData(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sessionId]);

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator color={Color.main}/></View>;

  return (
    <ExplanationScreen
      title="Giải thích Mini Test"
      questions={explanationData}
      onClose={() => router.back()}
    />
  );
}
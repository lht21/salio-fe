import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ExplanationScreen, { ExplanationQuestion } from '@/components/LessonReview/ExplanationScreen';

const readingQuestions: ExplanationQuestion[] = [
  {
    id: 'reading-1',
    indexLabel: 'Bài 1 - Câu 1',
    question: '박수진 씨는 의사입니다. (Cô Park Su-jin là bác sĩ.)',
    answers: [
      { label: '다른 (Khác)', state: 'correct' },
      { label: '같은 (Giống)', state: 'default' },
    ],
    explanation: {
      title: 'Park Su-jin là nhân viên công ty',
      correctLabel: '다른 (Khác)',
      body: 'Trong đoạn văn, Park Su-jin tự giới thiệu: "저는 회사원입니다" (Tôi là nhân viên công ty). Vì vậy, câu nói cô ấy là bác sĩ là SAI.',
    },
  },
  {
    id: 'reading-2',
    indexLabel: 'Bài 1 - Câu 2',
    question: '최유진 씨는 한국대학교 학생입니다. (Cô Choi Yu-jin là sinh viên đại học Hàn Quốc.)',
    answers: [
      { label: '같은 (Giống)', state: 'default' },
      { label: '다른 (Khác)', state: 'incorrect' },
    ],
    explanation: {
      title: 'Xác nhận thông tin về Choi Yu-jin',
      correctLabel: '같은 (Giống)',
      body: 'Đoạn văn viết: "최유진: ... 한국대학교 학생입니다". Thông tin này trùng khớp hoàn toàn với câu hỏi.',
    },
  },
  {
    id: 'reading-3',
    indexLabel: 'Bài 1 - Câu 3',
    question: '리양 씨는 의사입니다. (Anh Li Yang là bác sĩ.)',
    answers: [
      { label: '같은 (Giống)', state: 'default' },
      { label: '다른 (Khác)', state: 'correct' },
    ],
    explanation: {
      title: 'Li Yang là nhân viên ngân hàng',
      correctLabel: '다른 (Khác)',
      body: 'Li Yang giới thiệu: "저는 리양입니다... 은행원입니다" (Tôi là Li Yang... là nhân viên ngân hàng). Vậy thông tin anh ấy là bác sĩ là SAI.',
    },
  },
  {
    id: 'reading-4',
    indexLabel: 'Bài 2 - Câu 1',
    question: '이 사람은 리양입니까? (Người này có phải Li Yang không?)',
    answers: [
      { label: '네 (Vâng)', state: 'correct' },
      { label: '아니요 (Không)', state: 'default' },
    ],
    explanation: {
      title: 'Xác nhận tên nhân vật',
      correctLabel: '네',
      body: 'Câu đầu tiên của đoạn văn là: "제 이름은 리양입니다" (Tên tôi là Li Yang). Đáp án đúng là "네".',
    },
  },
  {
    id: 'reading-5',
    indexLabel: 'Bài 2 - Câu 2',
    question: '이 사람은 중국 학생입니까? (Người này có phải sinh viên Trung Quốc không?)',
    answers: [
      { label: '아니요, 중국 공무원입니다', state: 'correct' },
    ],
    explanation: {
      title: 'Nghề nghiệp của Li Yang',
      correctLabel: '아니요, 중국 공무원입니다',
      body: 'Li Yang nói: "중국 사람입니다" (Là người Trung Quốc) và "저는 공무원입니다" (Tôi là công chức). Do đó anh ấy là công chức Trung Quốc chứ không phải sinh viên.',
    },
  },
  {
    id: 'reading-6',
    indexLabel: 'Bài 2 - Câu 3',
    question: '이 사람은 관광 가이드입니까? (Người này có phải hướng dẫn viên du lịch không?)',
    answers: [
      { label: '아니요, 중국 공무원입니다', state: 'correct' },
    ],
    explanation: {
      title: 'Phủ định nghề nghiệp hướng dẫn viên',
      correctLabel: '아니요, 중국 공무원입니다',
      body: 'Tương tự câu trước, vì Li Yang đã xác nhận mình là công chức (공무원), nên anh ấy không phải là hướng dẫn viên du lịch.',
    },
  },
];

export default function ReadingExplanationScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  return (
    <ExplanationScreen
      title="Kết quả"
      scoreLabel="Đúng 3/4"
      questions={readingQuestions}
      onClose={() => router.back()}
      onViewResult={() => router.push(`/lessons/${resolvedLessonId}/reading/result` as any)}
    />
  );
}
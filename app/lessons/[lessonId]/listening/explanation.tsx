import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ExplanationScreen, { ExplanationQuestion } from '@/components/LessonReview/ExplanationScreen';

const listeningQuestions: ExplanationQuestion[] = [
  {
    id: 'l1-e1-ox-1',
    indexLabel: 'Bài 1 - Câu 1',
    question: '남 씨는 학생입니다. (Anh Nam là học sinh.)',
    answers: [
      { label: '같은 (Giống)', state: 'default' },
      { label: '다른 (Khác)', state: 'incorrect' },
    ],
    explanation: {
      title: 'Nam nói "네, 학생입니다" (Vâng, là học sinh)',
      correctLabel: '같은 (Giống)',
      body: 'Trong đoạn hội thoại, khi được hỏi "남 씨는 학생입니까?", Nam trả lời "네, 학생입니다". Vì vậy câu "남 씨는 학생입니다" là ĐÚNG với nội dung bài nghe.',
    },
  },
  {
    id: 'l1-e1-ox-2',
    indexLabel: 'Bài 1 - Câu 2',
    question: '이지훈 씨는 회사원입니다. (Anh Lee Ji-hoon là nhân viên công ty.)',
    answers: [
      { label: '같은 (Giống)', state: 'correct' },
      { label: '다른 (Khác)', state: 'default' },
    ],
    explanation: {
      title: 'Người nữ xác nhận: "이지훈 씨는 회사원입니다"',
      correctLabel: '같은 (Giống)',
      body: 'Người nữ hỏi "이지훈 씨는 선생님입니까?" (Anh Lee Ji-hoon có phải giáo viên không?) và người nam trả lời "아니요, 회사원입니다" (Không, là nhân viên công ty). Vậy câu trên là ĐÚNG.',
    },
  },
  {
    id: 'l1-e1-ox-3',
    indexLabel: 'Bài 1 - Câu 3',
    question: '조현우 씨는 공무원입니다. (Anh Jo Hyun-woo là công chức.)',
    answers: [
      { label: '같은 (Giống)', state: 'default' },
      { label: '다른 (Khác)', state: 'correct' },
    ],
    explanation: {
      title: 'Jo Hyun-woo KHÔNG phải là công chức',
      correctLabel: '다른 (Khác)',
      body: 'Người nữ hỏi "조현우 씨는 공무원입니까?" (Anh Jo Hyun-woo có phải công chức không?). Người nam trả lời "아니요, 은행원입니다" (Không, là nhân viên ngân hàng). Vậy câu trên là SAI.',
    },
  },
  {
    id: 'l1-e1-ox-4',
    indexLabel: 'Bài 1 - Câu 4',
    question: '와완 씨는 의사입니다. (Anh Wawan là bác sĩ.)',
    answers: [
      { label: '같은 (Giống)', state: 'correct' },
      { label: '다른 (Khác)', state: 'default' },
    ],
    explanation: {
      title: 'Wawan là bác sĩ',
      correctLabel: '같은 (Giống)',
      body: 'Người nữ hỏi "와완 씨는 의사입니까?" (Anh Wawan có phải bác sĩ không?). Người nam trả lời "네, 의사입니다" (Vâng, là bác sĩ). Vậy câu trên là ĐÚNG.',
    },
  },

  {
    id: 'l2-e1-sa-1',
    indexLabel: 'Bài 2 - Câu 1',
    question: '수빈: _____? 박수빈입니다.',
    answers: [
      { label: '안녕하세요 / 안녕하십니까', state: 'correct' },
    ],
    explanation: {
      title: 'Câu chào hỏi trong tiếng Hàn',
      correctLabel: '안녕하세요 / 안녕하십니까',
      body: 'Trong tiếng Hàn, "안녕하세요" hoặc "안녕하십니까" đều là cách chào hỏi lịch sự. Đoạn hội thoại bắt đầu bằng "안녕하세요? 박수빈입니다" nên đáp án đúng là một trong hai cụm từ này.',
    },
  },
  {
    id: 'l2-e1-sa-2',
    indexLabel: 'Bài 2 - Câu 2',
    question: '화: __ 화입니다. 반갑습니다.',
    answers: [
      { label: '저는 / 전', state: 'correct' },
    ],
    explanation: {
      title: 'Đại từ nhân xưng "저는" (tôi là)',
      correctLabel: '저는 / 전',
      body: '"저는" là cách nói "tôi là" trang trọng, lịch sự. "전" là dạng viết tắt của "저는". Trong bài nghe, Hwa nói "저는 화입니다" (Tôi là Hwa).',
    },
  },
  {
    id: 'l2-e1-sa-3',
    indexLabel: 'Bài 2 - Câu 3',
    question: '수빈: 화 씨는 ___입니까?',
    answers: [
      { label: '회사원', state: 'correct' },
    ],
    explanation: {
      title: 'Hỏi về nghề nghiệp',
      correctLabel: '회사원',
      body: 'Subin hỏi "화 씨는 회사원입니까?" (Chị Hwa có phải nhân viên công ty không?). Từ cần điền là "회사원" (nhân viên công ty).',
    },
  },
  {
    id: 'l2-e1-sa-4',
    indexLabel: 'Bài 2 - Câu 4',
    question: '화: ___, 의사입니다. 박수빈 씨는 ___입니까?',
    answers: [
      { label: '아니요 / 선생님', state: 'correct' },
    ],
    explanation: {
      title: 'Phủ định "아니요" và hỏi nghề nghiệp',
      correctLabel: '아니요 / 선생님',
      body: 'Hwa trả lời "아니요, 의사입니다" (Không, tôi là bác sĩ) sau đó hỏi lại "박수빈 씨는 선생님입니까?" (Chị Park Subin có phải giáo viên không?).',
    },
  },
  {
    id: 'l2-e1-sa-5',
    indexLabel: 'Bài 2 - Câu 5',
    question: '수빈: _, 한국어 ___입니다.',
    answers: [
      { label: '네 / 선생님', state: 'correct' },
    ],
    explanation: {
      title: 'Khẳng định "네" và nghề nghiệp "giáo viên"',
      correctLabel: '네 / 선생님',
      body: 'Subin đáp lại "네, 한국어 선생님입니다" (Vâng, tôi là giáo viên tiếng Hàn). Vậy từ cần điền lần lượt là "네" và "선생님".',
    },
  },
  {
    id: 'l2-e1-mc-1',
    indexLabel: 'Bài 3 - Câu 1',
    question: '남 씨는 누구를 찾고 있습니까? (Anh Nam đang tìm ai?)',
    answers: [
      { label: '박준영 씨', state: 'correct' },
      { label: '최정우 씨', state: 'default' },
      { label: '이지훈 씨', state: 'default' },
    ],
    explanation: {
      title: 'Nam hỏi trực tiếp "박준영 씨입니까?"',
      correctLabel: '박준영 씨',
      body: 'Trong đoạn hội thoại, Nam hỏi "박준영 씨입니까?" (Có phải anh Park Joon-young không?). Điều này chứng tỏ anh ấy đang tìm Park Joon-young.',
    },
  },
  {
    id: 'l2-e1-mc-2',
    indexLabel: 'Bài 3 - Câu 2',
    question: '남 씨의 직업은 무엇입니까? (Nghề nghiệp của anh Nam là gì?)',
    answers: [
      { label: '의사', state: 'default' },
      { label: '학생', state: 'correct' },
      { label: '회사원', state: 'default' },
    ],
    explanation: {
      title: 'Nam tự giới thiệu "베트남대학교 학생입니다"',
      correctLabel: '학생',
      body: 'Nam nói: "제 이름은 남입니다. 베트남대학교 학생입니다" (Tên tôi là Nam. Tôi là sinh viên trường Đại học Việt Nam). Vậy nghề nghiệp của anh ấy là "학생" (sinh viên).',
    },
  },
];

export default function ListeningExplanationScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  return (
    <ExplanationScreen
      title="Kết quả"
      scoreLabel="Đúng 3/4"
      questions={listeningQuestions}
      onClose={() => router.back()}
      onViewResult={() => router.push(`/lessons/${resolvedLessonId}/listening/result` as any)}
    />
  );
}

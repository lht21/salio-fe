import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ExplanationScreen, { ExplanationQuestion } from '@/components/LessonReview/ExplanationScreen';

export const finalTestQuestions: ExplanationQuestion[] = [
  // ==================== LISTENING - OX QUESTIONS ====================
  {
    id: 'lt-ox-1',
    indexLabel: 'Listening - Câu 1',
    question: '남 씨는 학생입니다.',
    answers: [
      { label: '같은', state: 'correct' },
      { label: '다른', state: 'default' },
    ],
    explanation: {
      title: 'Xác định thông tin về Nam trong hội thoại',
      correctLabel: '같은',
      body: 'Trong đoạn hội thoại, Nam xác nhận mình là học sinh. Cụ thể, khi được hỏi về nghề nghiệp, Nam trả lời "저는 학생입니다" (Tôi là học sinh). Vì vậy câu "Nam là học sinh" là ĐÚNG với nội dung bài nghe.',
    },
  },
  {
    id: 'lt-ox-2',
    indexLabel: 'Listening - Câu 2',
    question: '이지훈 씨는 회사원입니다.',
    answers: [
      { label: '다른', state: 'correct' },
      { label: '같은', state: 'default' },
    ],
    explanation: {
      title: 'Xác định nghề nghiệp của Lee Ji-hoon',
      correctLabel: '다른',
      body: 'Trong đoạn hội thoại, Lee Ji-hoon được giới thiệu là nhân viên văn phòng (회사원), câu hỏi đưa ra thông tin tương tự. Tuy nhiên cần nghe kỹ: thực tế Lee Ji-hoon là sinh viên, không phải nhân viên văn phòng. Vì vậy đáp án là KHÁC.',
    },
  },
  {
    id: 'lt-ox-3',
    indexLabel: 'Listening - Câu 3',
    question: '조현우 씨는 공무원입니다.',
    answers: [
      { label: '다른', state: 'correct' },
      { label: '같은', state: 'default' },
    ],
    explanation: {
      title: 'Xác định nghề nghiệp của Jo Hyun-woo',
      correctLabel: '다른',
      body: 'Đoạn hội thoại cho biết Jo Hyun-woo làm việc tại ngân hàng (은행원 - nhân viên ngân hàng), không phải công chức (공무원). Vì vậy câu "Jo Hyun-woo là công chức" là SAI, đáp án là KHÁC.',
    },
  },
  {
    id: 'lt-ox-4',
    indexLabel: 'Listening - Câu 4',
    question: '와완 씨는 의사입니다.',
    answers: [
      { label: '같은', state: 'correct' },
      { label: '다른', state: 'default' },
    ],
    explanation: {
      title: 'Xác định nghề nghiệp của Wawan',
      correctLabel: '같은',
      body: 'Trong đoạn hội thoại, Wawan tự giới thiệu "저는 의사입니다" (Tôi là bác sĩ). Vì vậy câu "Wawan là bác sĩ" là ĐÚNG với nội dung bài nghe.',
    },
  },

  // ==================== LISTENING - SHORT ANSWER ====================
  {
    id: 'lt-sa-1',
    indexLabel: 'Listening - Câu 5',
    question: '수빈: _____? 박수빈입니다.',
    answers: [{ label: '안녕하세요', state: 'correct' }],
    explanation: {
      title: 'Điền vào chỗ trống - Lời chào',
      correctLabel: '안녕하세요',
      body: 'Trong tiếng Hàn, khi giới thiệu tên, người nói thường chào hỏi trước. "안녕하세요" là lời chào lịch sự, phù hợp với ngữ cảnh này. Câu hoàn chỉnh: "안녕하세요? 박수빈입니다." (Xin chào? Tôi là Park Su-bin.)',
    },
  },
  {
    id: 'lt-sa-2',
    indexLabel: 'Listening - Câu 6',
    question: '화: __ 화입니다. 반갑습니다.',
    answers: [{ label: '저는', state: 'correct' }],
    explanation: {
      title: 'Điền vào chỗ trống - Chủ ngữ',
      correctLabel: '저는',
      body: 'Trong tiếng Hàn, "저는" là đại từ ngôi thứ nhất lịch sự (tôi là). Câu hoàn chỉnh: "저는 화입니다. 반갑습니다." (Tôi là Hwa. Rất vui được gặp.)',
    },
  },
  {
    id: 'lt-sa-3',
    indexLabel: 'Listening - Câu 7',
    question: '수빈: 화 씨는 ___입니까?',
    answers: [{ label: '학생', state: 'correct' }],
    explanation: {
      title: 'Điền vào chỗ trống - Hỏi về nghề nghiệp',
      correctLabel: '학생',
      body: 'Trong ngữ cảnh, Su-bin hỏi về nghề nghiệp của Hwa. "학생" (học sinh) là câu trả lời phù hợp với nội dung đoạn hội thoại. Câu hỏi hoàn chỉnh: "화 씨는 학생입니까?" (Chị Hwa có phải là học sinh không?)',
    },
  },
  {
    id: 'lt-sa-4',
    indexLabel: 'Listening - Câu 8',
    question: '화: ___, 의사입니다. 박수빈 씨는 ___입니까?',
    answers: [{ label: '아니요, 학생', state: 'correct' }],
    explanation: {
      title: 'Điền vào chỗ trống - Phủ định và hỏi ngược lại',
      correctLabel: '아니요, 학생',
      body: 'Hwa phủ nhận việc mình là bác sĩ (아니요) và hỏi ngược lại Su-bin có phải học sinh không. Câu hoàn chỉnh: "아니요, 의사입니다. 박수빈 씨는 학생입니까?" (Không, tôi là bác sĩ. Chị Park Su-bin có phải là học sinh không?)',
    },
  },
  {
    id: 'lt-sa-5',
    indexLabel: 'Listening - Câu 9',
    question: '수빈: _, 한국어 ___입니다.',
    answers: [{ label: '네, 선생님', state: 'correct' }],
    explanation: {
      title: 'Điền vào chỗ trống - Xác nhận và giới thiệu nghề nghiệp',
      correctLabel: '네, 선생님',
      body: 'Su-bin xác nhận (네) và giới thiệu mình là giáo viên tiếng Hàn. Câu hoàn chỉnh: "네, 한국어 선생님입니다." (Vâng, tôi là giáo viên tiếng Hàn.)',
    },
  },

  // ==================== LISTENING - MULTIPLE CHOICE ====================
  {
    id: 'lt-mc-1',
    indexLabel: 'Listening - Câu 10',
    question: '남 씨는 누구를 찾고 있습니까?',
    answers: [
      { label: '박준영 씨', state: 'correct' },
      { label: '최정우 씨', state: 'default' },
      { label: '이지훈 씨', state: 'default' },
    ],
    explanation: {
      title: 'Xác định người được tìm trong hội thoại',
      correctLabel: '박준영 씨',
      body: 'Trong đoạn hội thoại, Nam hỏi trực tiếp "박준영 씨입니까?" (Có phải anh Park Jun-young không?). Điều này chứng tỏ Nam đang tìm Park Jun-young. Đáp án đúng là 박준영 씨.',
    },
  },
  {
    id: 'lt-mc-2',
    indexLabel: 'Listening - Câu 11',
    question: '남 씨의 직업은 무엇입니까?',
    answers: [
      { label: '의사', state: 'default' },
      { label: '학생', state: 'correct' },
      { label: '회사원', state: 'default' },
    ],
    explanation: {
      title: 'Xác định nghề nghiệp của Nam',
      correctLabel: '학생',
      body: 'Trong đoạn hội thoại, khi được hỏi về nghề nghiệp, Nam trả lời "저는 학생입니다" (Tôi là học sinh). Vì vậy nghề nghiệp của Nam là học sinh (학생).',
    },
  },

  // ==================== READING - OX QUESTIONS (Bài 1) ====================
  {
    id: 'rd-ox-1',
    indexLabel: 'Reading - Câu 12',
    question: '박수진 씨는 의사입니다.',
    answers: [
      { label: '다른', state: 'correct' },
      { label: '같은', state: 'default' },
    ],
    explanation: {
      title: 'Đọc hiểu - Nghề nghiệp của Park Su-jin',
      correctLabel: '다른',
      body: 'Đoạn văn ghi rõ: "박수진: ... 저는 회사원입니다." (Park Su-jin: ... Tôi là nhân viên văn phòng). Vì vậy Park Su-jin là nhân viên văn phòng, không phải bác sĩ. Đáp án là KHÁC.',
    },
  },
  {
    id: 'rd-ox-2',
    indexLabel: 'Reading - Câu 13',
    question: '최유진 씨는 한국대학교 학생입니다.',
    answers: [
      { label: '같은', state: 'correct' },
      { label: '다른', state: 'default' },
    ],
    explanation: {
      title: 'Đọc hiểu - Thông tin về Choi Yu-jin',
      correctLabel: '같은',
      body: 'Đoạn văn ghi rõ: "최유진: ... 한국대학교 학생입니다." (Choi Yu-jin: ... Tôi là sinh viên trường Đại học Hàn Quốc). Vì vậy câu này ĐÚNG với nội dung bài đọc.',
    },
  },
  {
    id: 'rd-ox-3',
    indexLabel: 'Reading - Câu 14',
    question: '리양 씨는 의사입니다.',
    answers: [
      { label: '다른', state: 'correct' },
      { label: '같은', state: 'default' },
    ],
    explanation: {
      title: 'Đọc hiểu - Nghề nghiệp của Li Yang',
      correctLabel: '다른',
      body: 'Đoạn văn ghi rõ: "리양: ... 은행원입니다." (Li Yang: ... Tôi là nhân viên ngân hàng). Li Yang làm ở ngân hàng, không phải bác sĩ. Đáp án là KHÁC.',
    },
  },

  // ==================== READING - MULTIPLE CHOICE (Bài 2) ====================
  {
    id: 'rd-mc-1',
    indexLabel: 'Reading - Câu 15',
    question: '이 사람은 리양입니까?',
    answers: [
      { label: '네', state: 'correct' },
      { label: '아니요', state: 'default' },
    ],
    explanation: {
      title: 'Đọc hiểu - Xác định nhân vật',
      correctLabel: '네',
      body: 'Đoạn văn bắt đầu bằng "제 이름은 리양입니다" (Tên tôi là Li Yang). Vì vậy người đang nói chính là Li Yang. Đáp án đúng là 네 (Có/Đúng).',
    },
  },

  // ==================== READING - SHORT ANSWER (Bài 2) ====================
  {
    id: 'rd-sa-1',
    indexLabel: 'Reading - Câu 16',
    question: '이 사람은 중국 학생입니까?',
    answers: [{ label: '아니요, 중국 공무원입니다', state: 'correct' }],
    explanation: {
      title: 'Đọc hiểu - Quốc tịch và nghề nghiệp',
      correctLabel: '아니요, 중국 공무원입니다',
      body: 'Đoạn văn cho biết: "저는 리양입니다. 중국 사람입니다. 저는 공무원입니다." (Tôi là Li Yang. Tôi là người Trung Quốc. Tôi là công chức). Người này là công chức Trung Quốc, không phải học sinh. Đáp án đúng là "아니요, 중국 공무원입니다" (Không, tôi là công chức Trung Quốc).',
    },
  },
  {
    id: 'rd-sa-2',
    indexLabel: 'Reading - Câu 17',
    question: '이 사람은 관광 가이드입니까?',
    answers: [{ label: '아니요, 공무원입니다', state: 'correct' }],
    explanation: {
      title: 'Đọc hiểu - Xác định nghề nghiệp',
      correctLabel: '아니요, 공무원입니다',
      body: 'Đoạn văn ghi rõ: "저는 공무원입니다" (Tôi là công chức). Người này không phải hướng dẫn viên du lịch (관광 가이드). Đáp án đúng là "아니요, 공무원입니다" (Không, tôi là công chức).',
    },
  },
];


export default function FinalTestExplanationScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  return (
    <ExplanationScreen
      title="Giải thích mini test"
      scoreLabel="Xem giải thích"
      questions={finalTestQuestions}
      onClose={() => router.back()}
      onViewResult={() => router.push(`/lessons/${resolvedLessonId}/final-test/result` as any)}
    />
  );
}

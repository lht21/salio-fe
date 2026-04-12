import React from 'react';

import LessonIntroTemplate from '../../../../components/LessonIntroTemplate';

export default function ReadingIntroScreen() {
  return (
    <LessonIntroTemplate
      imageSource={require('../../../../assets/images/horani/intro-reading.jpeg')}
      heading="Đọc"
      accentText="Mở khóa kỹ năng đọc!"
      description="Ở vòng này, bạn sẽ luyện tập kỹ năng đọc tiếng Hàn. Mỗi bài sẽ cung cấp các đoạn văn và câu mẫu để bạn đọc và hiểu nội dung. Hãy chú ý đến từ vựng, cấu trúc câu và cố gắng đọc nhiều lần để nâng cao khả năng đọc hiểu nhé!"
      nextPath={(lessonId) => `/lessons/${lessonId}/reading/practice`}
    />
  );
}

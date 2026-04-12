import React from 'react';

import LessonIntroTemplate from '../../../../components/LessonIntroTemplate';

export default function ListeningIntroScreen() {
  return (
    <LessonIntroTemplate
      imageSource={require('../../../../assets/images/horani/intro-listening.jpeg')}
      heading="Nghe"
      accentText="Mở khóa kỹ năng nghe!"
      description="Ở vòng này, bạn sẽ luyện tập kỹ năng nghe tiếng Hàn. Mỗi bài sẽ cung cấp các đoạn hội thoại và câu mẫu để bạn lắng nghe và hiểu nội dung. Hãy chú ý đến cách phát âm, ngữ điệu và nghe lại nhiều lần để cải thiện khả năng nghe hiểu nhé!"
      nextPath={(lessonId) => `/lessons/${lessonId}/listening/practice`}
    />
  );
}

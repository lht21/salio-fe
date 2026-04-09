import React from 'react';

import LessonIntroTemplate from '../../../../components/LessonIntroTemplate';

export default function WritingIntroScreen() {
  return (
    <LessonIntroTemplate
      imageSource={require('../../../../assets/images/tubo/intro-writing.jpeg')}
      heading="Viết"
      accentText="Mở khóa kỹ năng viết!"
      description="Ở vòng này, bạn sẽ luyện tập kỹ năng viết tiếng Hàn. Mỗi bài sẽ cung cấp các từ vựng và câu mẫu để bạn luyện viết và ghi nhớ cách sử dụng. Hãy chú ý đến cách viết chữ, cấu trúc câu và thực hành nhiều lần để cải thiện kỹ năng viết nhé!"
      nextPath={(lessonId) => `/lessons/${lessonId}/writing/practice`}
    />
  );
}

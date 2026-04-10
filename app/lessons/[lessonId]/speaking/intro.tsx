import React from 'react';

import LessonIntroTemplate from '../../../../components/LessonIntroTemplate';

export default function SpeakingIntroScreen() {
  return (
    <LessonIntroTemplate
      imageSource={require('../../../../assets/images/tubo/intro-speaking.jpeg')}
      heading="Nói"
      accentText="Khám phá cách nói!"
      description="Ở vòng này, bạn sẽ luyện tập kỹ năng nói tiếng Hàn. Mỗi bài sẽ cung cấp các câu mẫu, từ vựng và tình huống giao tiếp thực tế để bạn luyện phát âm và nói theo. Hãy chú ý cách phát âm, ngữ điệu và thử nói lại nhiều lần để cải thiện khả năng giao tiếp nhé!"
      nextPath={(lessonId) => `/lessons/${lessonId}/speaking/practice`}
    />
  );
}

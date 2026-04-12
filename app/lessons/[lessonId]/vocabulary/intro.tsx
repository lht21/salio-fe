import React from 'react';

import LessonIntroTemplate from '../../../../components/LessonIntroTemplate';

export default function VocabularyIntroScreen() {
  return (
    <LessonIntroTemplate
      imageSource={require('../../../../assets/images/horani/intro-vocab.jpeg')}
      heading="Từ vựng cơ bản"
      description="Để tăng cường Siêu trí nhớ thì ở vòng này bạn sẽ lựa chọn trắc nghiệm của các từ vựng đã học trước đó! Cố lên nào!"
      buttonVariant="Green"
      leftMetaText="Vòng 1"
      rightMetaText="Thẻ ghi nhớ"
      nextPath={(lessonId) => `/lessons/${lessonId}/vocabulary/flashcard`}
    />
  );
}

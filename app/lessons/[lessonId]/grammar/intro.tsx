import React from 'react';

import LessonIntroTemplate from '../../../../components/LessonIntroTemplate';

export default function GrammarIntroScreen() {
  return (
    <LessonIntroTemplate
      imageSource={require('../../../../assets/images/tubo/intro-grammar.jpeg')}
      heading="Ngữ pháp cơ bản"
      accentText="Giải mã cấu trúc!"
      description="Ở vòng này, bạn sẽ học các cấu trúc ngữ pháp quan trọng. Mỗi cấu trúc sẽ được giải thích rõ ràng kèm ví dụ minh họa và cách dùng cụ thể. Hãy chú ý sự khác biệt nhỏ trong cách chia động từ và ngữ cảnh sử dụng nhé!"
      nextPath={(lessonId) => `/lessons/${lessonId}/grammar/detail`}
    />
  );
}

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import LessonBottomSheet from './LessonBottomSheet';
import LessonService from '../../api/services/lesson.service';

// Khai báo biến mock ra ngoài để Component và Test cùng theo dõi chung 1 object
const mockPush = jest.fn();
const mockBack = jest.fn();

// 1. Mock các thư viện và Hooks
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    back: mockBack,
  })),
}));

// Mock thư viện đa ngôn ngữ để tắt cảnh báo console.warn
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('phosphor-react-native', () => ({
  CaretRightIcon: 'CaretRightIcon',
  TrophyIcon: 'TrophyIcon',
  LockKeyIcon: 'LockKeyIcon',
  BookOpenTextIcon: 'BookOpenTextIcon',
  HeadphonesIcon: 'HeadphonesIcon',
  MicrophoneStageIcon: 'MicrophoneStageIcon',
  PenNibStraightIcon: 'PenNibStraightIcon',
  SpeakerHighIcon: 'SpeakerHighIcon',
  BookmarkSimpleIcon: 'BookmarkSimpleIcon',
  CaretDownIcon: 'CaretDownIcon',
  CaretUpIcon: 'CaretUpIcon',
  CheckCircleIcon: 'CheckCircleIcon',
}));

// Mock thư viện moti để tránh lỗi biên dịch (SyntaxError: Unexpected token 'export') và bỏ qua animation
jest.mock('moti', () => {
  const { View } = require('react-native');
  return {
    MotiView: View,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock @gorhom/bottom-sheet thành các thẻ View/ScrollView thông thường để tránh lỗi Reanimated
jest.mock('@gorhom/bottom-sheet', () => {
  const { View, ScrollView } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, footerComponent: Footer }: any) => (
      <View testID="bottom-sheet">
        {children}
        {Footer && <Footer />}
      </View>
    ),
    BottomSheetBackdrop: ({ children }: any) => <View testID="bottom-sheet-backdrop">{children}</View>,
    BottomSheetScrollView: ({ children }: any) => <ScrollView testID="bottom-sheet-scroll">{children}</ScrollView>,
    BottomSheetFooter: ({ children }: any) => <View testID="bottom-sheet-footer">{children}</View>,
  };
});

// Mock ThemeContext để tránh lỗi khi component Button gọi hook useTheme()
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: { bg: '#FFFFFF', main: '#000000', text: '#000000' },
    theme: 'light',
  }),
}));

// Mock LessonService
jest.mock('../../api/services/lesson.service');
const mockedLessonService = LessonService as jest.Mocked<typeof LessonService>;

describe('LessonBottomSheet Component', () => {
  const mockProps = {
    lessonId: 'lesson-123',
    unit: 'Unit 1',
    title: 'Xin chào tiếng Hàn',
    lessonType: 'standard' as const,
    onClose: jest.fn(),
  };

  // Chuẩn bị dữ liệu trả về cho Mock API
  const mockModules = {
    vocabulary: [{ _id: 'v1', word: '안녕하세요' }],
    grammar: [{ _id: 'g1', structure: 'N + 은/는' }],
  };

  const mockProgressLocked = {
    data: {
      sections: {
        vocabulary: { isUnlocked: true, progress: 100, items: [] },
        grammar: { isUnlocked: true, progress: 50, items: [] },
      },
      finalTestStatus: { isUnlocked: false },
    }
  };

  const mockProgressUnlocked = {
    data: {
      sections: {
        vocabulary: { isUnlocked: true, progress: 100, items: [] },
        grammar: { isUnlocked: true, progress: 100, items: [] },
      },
      finalTestStatus: { isUnlocked: true },
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('Test 1 - Trạng thái Loading: Hiển thị chữ "Đang tải module..." khi vừa mount', async () => {
    // Giả lập API gọi chưa xong (Pending)
    mockedLessonService.start.mockImplementation(() => new Promise(() => {}));
    mockedLessonService.getModules.mockImplementation(() => new Promise(() => {}));

    render(<LessonBottomSheet {...mockProps} />);

    // Phải có trạng thái Loading
    expect(screen.getByText('Đang tải module...')).toBeTruthy();
  });

  it('Test 2 - Render Dữ liệu: Hiển thị các section và tiêu đề sau khi fetch data thành công', async () => {
    // Giả lập API trả về thành công
    mockedLessonService.start.mockResolvedValue(mockProgressLocked as any);
    mockedLessonService.getModules.mockResolvedValue(mockModules as any);

    render(<LessonBottomSheet {...mockProps} />);

    // Chờ cho chữ loading biến mất
    await waitFor(() => {
      expect(screen.queryByText('Đang tải module...')).toBeNull();
    });

    // Kiểm tra title bài học được render
    expect(screen.getByText(mockProps.title)).toBeTruthy();
    expect(screen.getByText(mockProps.unit)).toBeTruthy();

    // Kiểm tra các section đã được render từ hook useLessonModules
    expect(screen.getByText(/1 từ vựng/i)).toBeTruthy();
    expect(screen.getByText(/1 ngữ pháp/i)).toBeTruthy();
  });

  it('Test 3 - Tương tác Nút bấm: Nút "Mini test" bị vô hiệu hóa khi finalTestLocked = true', async () => {
    mockedLessonService.start.mockResolvedValue(mockProgressLocked as any);
    mockedLessonService.getModules.mockResolvedValue(mockModules as any);

    render(<LessonBottomSheet {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Đang tải module...')).toBeNull();
    });

    // Xác nhận text hiển thị ở trạng thái locked
    expect(screen.getByText('Hoàn thành bài học để mở khóa')).toBeTruthy();
    expect(screen.getByText('Bài kiểm tra cuối khóa')).toBeDisabled();
  });

  it('Test 4 - Tương tác Nút bấm: Có thể bấm "Mini test" khi đã mở khóa và chuyển trang chính xác', async () => {
    // Sử dụng Fake Timers để test hàm setTimeout
    jest.useFakeTimers();
    mockedLessonService.start.mockResolvedValue(mockProgressUnlocked as any);
    mockedLessonService.getModules.mockResolvedValue(mockModules as any);

    render(<LessonBottomSheet {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Đang tải module...')).toBeNull();
    });

    const miniTestBtn = screen.getByText('Bài kiểm tra cuối khóa');
    expect(miniTestBtn).not.toBeDisabled();
    fireEvent.press(miniTestBtn);

    expect(mockBack).toHaveBeenCalled();
    jest.runAllTimers(); // Tua nhanh cái setTimeout 100ms trong code của bạn
    expect(mockPush).toHaveBeenCalledWith(`/lessons/${mockProps.lessonId}/final-test/exam`);

    jest.useRealTimers(); // Trả lại thời gian thực cho các test case khác (nếu có)
  });

  it('Test 5 - Tương tác CTA: Đề xuất chuyển sang phần tiếp theo khi phần trước đã đạt 100%', async () => {
    jest.useFakeTimers();

    // Giả lập: Từ vựng đã học 100%, Ngữ pháp vừa được mở khóa (0%)
    const mockProgressPartial = {
      data: {
        sections: {
          vocabulary: { isUnlocked: true, progress: 100, items: [] },
          grammar: { isUnlocked: true, progress: 0, items: [] },
        },
        finalTestStatus: { isUnlocked: false },
      }
    };

    mockedLessonService.start.mockResolvedValue(mockProgressPartial as any);
    mockedLessonService.getModules.mockResolvedValue(mockModules as any);

    render(<LessonBottomSheet {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Đang tải module...')).toBeNull();
    });

    // Nút CTA ở Sticky Footer phải hiển thị "Bắt đầu ngay!" cho phần Ngữ pháp (do tiến độ đang 0%)
    const ctaBtn = screen.getByText('Bắt đầu ngay!');
    expect(ctaBtn).toBeTruthy();
    expect(ctaBtn).not.toBeDisabled();

    // Giả lập người dùng bấm nút
    fireEvent.press(ctaBtn);

    // Đảm bảo hành động đóng modal và chuyển trang tới phần Ngữ pháp (chứ không phải Từ vựng)
    expect(mockBack).toHaveBeenCalled();
    jest.runAllTimers(); 
    expect(mockPush).toHaveBeenCalledWith(`/lessons/${mockProps.lessonId}/grammar/intro`);

    jest.useRealTimers();
  });
});
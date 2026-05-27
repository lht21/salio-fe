import LessonService from './lesson.service';
import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

// Mock apiClient
jest.mock('../client');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('LessonService', () => {
  // Reset lại toàn bộ mock sau mỗi test case để đảm bảo không bị ảnh hưởng chéo
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('nên gọi API và trả về danh sách bài học thành công', async () => {
      // Arrange
      const mockParams = { page: 1, limit: 10 };
      const mockResponseData = {
        data: {
          lessons: [{ id: '1', title: 'Lesson 1' }],
          total: 1,
          page: 1,
          pages: 1,
        },
      };
      mockedApiClient.get.mockResolvedValueOnce(mockResponseData);

      // Act
      const result = await LessonService.getAll(mockParams);

      // Assert
      expect(mockedApiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.LESSON.GET_ALL, { params: mockParams });
      expect(result).toEqual(mockResponseData.data);
    });

    it('nên ném ra lỗi (throw error) khi gặp lỗi mạng (Network Error)', async () => {
      // Arrange
      const mockError = { response: { data: { message: 'Network Error' } } };
      mockedApiClient.get.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(LessonService.getAll()).rejects.toEqual(mockError.response.data);
      expect(mockedApiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.LESSON.GET_ALL, { params: undefined });
    });
  });

  describe('start', () => {
    it('nên gọi API start bài học với URL chính xác', async () => {
      // Arrange
      const mockLessonId = 'lesson-123';
      const mockResponseData = { data: { lessonId: mockLessonId, progress: 0 } };
      mockedApiClient.post.mockResolvedValueOnce(mockResponseData);

      // Act
      const result = await LessonService.start(mockLessonId);

      // Assert
      expect(mockedApiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.LESSON.START(mockLessonId));
      expect(result).toEqual(mockResponseData.data);
    });
  });

  describe('updateSectionProgress', () => {
    it('nên gửi payload và gọi PATCH đúng endpoint', async () => {
      // Arrange
      const mockLessonId = 'lesson-123';
      const mockSectionType = 'vocabulary';
      const mockItemId = 'item-456';
      const mockPayload = { status: 'completed' as const, percentage: 100, score: 10 };
      const mockResponseData = { data: { success: true } };
      mockedApiClient.patch.mockResolvedValueOnce(mockResponseData);

      // Act
      const result = await LessonService.updateSectionProgress(mockLessonId, mockSectionType, mockItemId, mockPayload);

      // Assert
      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        API_ENDPOINTS.LESSON.UPDATE_SECTION_PROGRESS(mockLessonId, mockSectionType, mockItemId),
        mockPayload
      );
      expect(result).toEqual(mockResponseData.data);
    });
  });
});
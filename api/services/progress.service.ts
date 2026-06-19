import apiClient from '../client'; // Có thể chỉnh lại đường dẫn import tùy vào cấu trúc thư mục thực tế
import { API_ENDPOINTS } from '../endpoints';
import { SkillHistoryResponse, SkillChartDataResponse, SkillType } from '../types/progress.type';

export interface GetSkillHistoryParams {
  page?: number;
  limit?: number;
  skill?: SkillType | string;
}

const ProgressService = {
  /**
   * Lấy dữ liệu biểu đồ tiến độ và nhận xét cho một kỹ năng cụ thể
   * @param skill Tên kỹ năng (reading, listening, writing, speaking)
   * @param limit Số điểm dữ liệu giới hạn (tùy chọn)
   */
  getSkillChartData: async (skill: SkillType | string, limit?: number) => {
    try {
      const response = await apiClient.get<SkillChartDataResponse>(API_ENDPOINTS.PROGRESS.GET_SKILL_CHART(skill), {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy lịch sử tiến độ kỹ năng của người dùng (phân trang)
   */
  getSkillHistory: async (params?: GetSkillHistoryParams) => {
    try {
      const response = await apiClient.get<SkillHistoryResponse>(API_ENDPOINTS.PROGRESS.GET_HISTORY, { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};

export default ProgressService;
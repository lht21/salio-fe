import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../api/types/user.types';
import UserService from '../api/services/user.service';
import i18n from '../locales/config';
import * as SecureStore from 'expo-secure-store';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>; // Cập nhật thêm
  logout: () => Promise<void>; // Cập nhật thêm
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      // UserService.getMe() đã return response.data là kiểu BaseResponse<UserProfile>
      const res = await UserService.getMe();
      
      if (res.success) {
        setUser(res.data); // Bóc tách data từ BaseResponse để lấy UserProfile
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng trong UserContext:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Lắng nghe sự thay đổi của user.preferences để đồng bộ Đa ngôn ngữ
  useEffect(() => {
    if (user?.preferences?.language) {
      if (i18n && typeof i18n.changeLanguage === 'function' && i18n.language !== user.preferences.language) {
        i18n.changeLanguage(user.preferences.language);
      }
    }
  }, [user?.preferences?.language]);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      setUser(null);
    } catch (error) {
      console.error('Lỗi khi dọn dẹp bộ nhớ đăng xuất:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser phải được sử dụng bên trong UserProvider');
  }
  return context;
};
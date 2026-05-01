import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import vi from '../locales/vi.json';
import en from '../locales/en.json';
import ko from '../locales/ko.json';

export const resources = {
  vi: { translation: vi },
  en: { translation: en },
  ko: { translation: ko },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Ngôn ngữ mặc định khởi tạo
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // react đã bảo vệ chống XSS
    },
  });

export default i18n;
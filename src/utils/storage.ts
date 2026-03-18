import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const setToken = (token: string) => storage.set('userToken', token);
export const getToken = () => storage.getString('userToken');
export const clearToken = () => storage.delete('userToken');
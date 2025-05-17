import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_API_URL_REACT_APP_SECRET_KEY || 'L29a847Mnvju**!@@@'; // Fallback for development

export const encryptObject = (data: object) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
}

export const decryptString = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
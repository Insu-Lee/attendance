import CryptoJS from 'crypto-js';

export const encryptPrivateKey = (privateKey: string) => {
  const salt = process.env.REACT_APP_SALT || '';
  const encrypted = CryptoJS.AES.encrypt(privateKey, salt).toString();

  return encrypted;
};

export const decryptPrivateKey = (encryptedPrivateKey: string) => {
  const salt = process.env.REACT_APP_SALT || '';
  const decrypted = CryptoJS.AES.decrypt(encryptedPrivateKey, salt).toString(
    CryptoJS.enc.Utf8
  );

  return decrypted;
};

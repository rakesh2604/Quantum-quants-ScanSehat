import CryptoJS from "crypto-js";

export type EncryptionBundle = {
  ciphertext: string;
  iv: string;
  salt: string;
};

const deriveKey = (secret: string, salt: CryptoJS.lib.WordArray) =>
  CryptoJS.PBKDF2(secret, salt, { keySize: 256 / 32, iterations: 1000 });

export const encryptFile = async (file: File, secret: string): Promise<EncryptionBundle> => {
  const buffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const key = deriveKey(secret, salt);
  const encrypted = CryptoJS.AES.encrypt(wordArray, key, { iv });
  return {
    ciphertext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
    iv: CryptoJS.enc.Base64.stringify(iv),
    salt: CryptoJS.enc.Base64.stringify(salt)
  };
};

const wordArrayToUint8Array = (wordArray: CryptoJS.lib.WordArray) => {
  const { words, sigBytes } = wordArray;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
};

export const decryptToBlob = (bundle: EncryptionBundle, secret: string, mime: string) => {
  const salt = CryptoJS.enc.Base64.parse(bundle.salt);
  const iv = CryptoJS.enc.Base64.parse(bundle.iv);
  const key = deriveKey(secret, salt);
  const ciphertext = CryptoJS.enc.Base64.parse(bundle.ciphertext);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, { iv });
  const bytes = wordArrayToUint8Array(decrypted);
  return new Blob([bytes], { type: mime });
};

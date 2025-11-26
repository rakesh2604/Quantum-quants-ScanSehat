import Tesseract from "tesseract.js";

export const fallbackOCR = async (file: File) => {
  const result = await Tesseract.recognize(file, "eng", { logger: () => undefined });
  return result.data.text;
};

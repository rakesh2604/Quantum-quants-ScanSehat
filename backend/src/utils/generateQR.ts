import QRCode from "qrcode";

export const generateQRDataUrl = async (payload: string) => {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H",
    width: 300,
    margin: 2
  });
};

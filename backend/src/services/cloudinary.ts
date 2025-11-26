import { v2 as cloudinary } from "cloudinary";
import { config } from "../config";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET
});

export const uploadBuffer = async (buffer: Buffer, folder: string, fileName: string) => {
  return cloudinary.uploader.upload(`data:application/octet-stream;base64,${buffer.toString("base64")}`, {
    folder,
    public_id: fileName,
    resource_type: "raw",
    overwrite: true
  });
};

export const getCloudinary = () => cloudinary;

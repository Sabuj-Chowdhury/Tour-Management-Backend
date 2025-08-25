import { v2 as cloudinary } from "cloudinary";
import { envVariable } from "./env";

// Configuration
cloudinary.config({
  cloud_name: envVariable.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVariable.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVariable.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;

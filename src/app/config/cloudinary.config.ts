/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { envVariable } from "./env";
import AppError from "../errorHelpers/AppError";

// Configuration
cloudinary.config({
  cloud_name: envVariable.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVariable.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVariable.CLOUDINARY.CLOUDINARY_API_SECRET,
});

// delete function to delete image from cloudinary
export const deleteImageFromCloudinary = async (url: string) => {
  //  https://res.cloudinary.com/djzppynpk/image/upload/v1753126572/ay9roxiv8ue-1753126570086-download-2-jpg.jpg.jpg

  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    // console.log({ match });

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
  } catch (error: any) {
    throw new AppError(401, "Cloudinary image deletion failed", error.message);
  }
};

export const cloudinaryUpload = cloudinary;

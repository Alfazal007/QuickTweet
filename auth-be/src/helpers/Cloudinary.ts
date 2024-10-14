import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import { envVariables } from "../config/envLoader";

const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    try {
        cloudinary.config({
            api_key: envVariables.cloudinaryApiKey,
            cloud_name: envVariables.cloudinaryCloudName,
            api_secret: envVariables.cloudinaryApiSecret,
            secure: true
        });
        if (!localFilePath) {
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (err) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};


const deleteFromCloudinary = async (url: string) => {
    try {
        cloudinary.config({
            api_key: envVariables.cloudinaryApiKey,
            cloud_name: envVariables.cloudinaryCloudName,
            api_secret: envVariables.cloudinaryApiSecret,
        });
        if (!url) {
            return null;
        }
        const splitUrl = url.split("/");
        const filename = splitUrl[splitUrl.length - 1];
        const publicId = filename.split(".")[0];
        if (!publicId) {
            return null;
        }
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (err) {
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };

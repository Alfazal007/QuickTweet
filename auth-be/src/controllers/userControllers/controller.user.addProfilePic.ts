import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { IMAGEUPLOADERROR, ISSUEUPLOADINGTOCLOUDINARY, ISSUEWITHDATABASE, UPDATEDPROFILEPICSUCCESSFULLY, USERNOTFOUND } from "../../constants/ReturnTypes";
import { deleteFromCloudinary, uploadOnCloudinary } from "../../helpers/Cloudinary";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const updateProfilePic = asyncHandler(async(req: Request, res: Response) => {
    if(!req.user) {
        return res.status(401).json(new ApiError(401, USERNOTFOUND, []));
    }
    const profilePicLocalPath = req.file?.path;
    if (!profilePicLocalPath) {
        return res
            .status(401)
            .json(
                new ApiError(401, IMAGEUPLOADERROR, [])
            );
    }
    const prevUrl = req.user.profilePic;
    if(prevUrl) {
        await deleteFromCloudinary(prevUrl);
    }
    const cloudinaryResult = await uploadOnCloudinary(profilePicLocalPath);
    if(!cloudinaryResult) {
        return res.status(400).json(new ApiError(400, ISSUEUPLOADINGTOCLOUDINARY, []));
    }
    try {
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                profilePic: cloudinaryResult.url
            }
        });
        return res.status(200).json(new ApiResponse(200, UPDATEDPROFILEPICSUCCESSFULLY, {}))
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []))
    }
});

export {updateProfilePic}

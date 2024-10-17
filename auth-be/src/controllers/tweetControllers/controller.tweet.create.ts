import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { CREATEDTWEET, ISSUEUPLOADINGTOCLOUDINARY, ISSUEWITHDATABASE, NODATATOBEUPLOADED, USERNOTFOUND } from "../../constants/ReturnTypes";
import { uploadOnCloudinary } from "../../helpers/Cloudinary";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const createTweet = asyncHandler(async(req: Request, res: Response) => {
    if(!req.user) {
        return res.status(401).json(new ApiError(401, USERNOTFOUND, []));
    }
    const newTweetImgLocalPath = req.file?.path;
    let toBeUpdated = {
        image: "",
        descsription: ""
    }

    if(newTweetImgLocalPath) {
        const cloudinaryResult = await uploadOnCloudinary(newTweetImgLocalPath);
        if(!cloudinaryResult) {
            return res.status(400).json(new ApiError(400, ISSUEUPLOADINGTOCLOUDINARY, []));
        }
        toBeUpdated.image = cloudinaryResult.url;
    }
    if(req.body.description) {
        toBeUpdated.descsription = req.body.description;
    }
    if(!newTweetImgLocalPath && !req.body.description) {
        return res.status(400).json(new ApiError(400, NODATATOBEUPLOADED, []))
    }
    let hashtags = [];
    if(req.body.hashtags) {
        hashtags = req.body.hashtags.split(",");
    }
    hashtags = hashtags.filter((str: string) => str.length > 0);
    try {
        const newTweet = await prisma.tweet.create({
            data: {
                description: toBeUpdated.descsription,
                picture: toBeUpdated.image,
                creatorId: req.user.id,
                hashtags
            },
            select: {
                description: true,
                picture: true,
                creatorId: true,
                hashtags: true
            }
        });
        return res.status(201).json(new ApiResponse(201, CREATEDTWEET, newTweet));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    createTweet
}

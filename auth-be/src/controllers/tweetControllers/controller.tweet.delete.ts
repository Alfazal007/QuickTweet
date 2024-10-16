import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { DELETETWEETSUCCESSFUL, ISSUEWITHDATABASE, NOREQUESTBODY, TWEETNOTFOUND, UNAUTHORIZEDDELETETWEET, USERNOTFOUND, ZODERROR } from "../../constants/ReturnTypes";
import { deleteTweetType } from "../../zodTypes/zod.tweet.deleteTweet";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";
import { deleteFromCloudinary } from "../../helpers/Cloudinary";

const deleteTweetController = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    if(!req.user) {
        return res.status(401).json(new ApiError(401, USERNOTFOUND, []));
    }
    const parsedData = deleteTweetType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    try {
        const tweetToBeDeleted = await prisma.tweet.findFirst({
            where: {
                id: parsedData.data.tweetId
            }
        });
        if(!tweetToBeDeleted) {
            return res.status(404).json(new ApiError(404, TWEETNOTFOUND, []));
        }
        if(tweetToBeDeleted.creatorId != req.user.id) {
            return res.status(401).json(new ApiError(401, UNAUTHORIZEDDELETETWEET, []));
        }
        await prisma.tweet.delete({
            where: {
                id: parsedData.data.tweetId
            }
        });
        if(tweetToBeDeleted.picture) {
            await deleteFromCloudinary(tweetToBeDeleted.picture);
        }
        return res.status(200).json(new ApiResponse(200, DELETETWEETSUCCESSFUL, {}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    deleteTweetController
}

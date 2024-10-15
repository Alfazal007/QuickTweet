import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { DELETEREPOSTSUCCESSFUL, ISSUEWITHDATABASE, NOREQUESTBODY, REPOSTNOTFOUND, UNAUTHORIZED, UNAUTHORIZEDDELETEREPOST, ZODERROR } from "../../constants/ReturnTypes";
import { prisma } from "../../constants/prisma";
import { deleteRepostType } from "../../zodTypes/zod.repost.delete";
import { ApiResponse } from "../../utils/ApiResponse";

const deleteRepost = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    const parsedData = deleteRepostType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    try {
        const repostToBeDeleted = await prisma.repost.findFirst({
            where: {
                id: parsedData.data.repostId
            }
        });
        if(!repostToBeDeleted) {
            return res.status(400).json(new ApiError(400, REPOSTNOTFOUND, []));
        }
        if(repostToBeDeleted.creatorId != req.user.id) {
            return res.status(401).json(new ApiError(401, UNAUTHORIZEDDELETEREPOST, []))
        }
        await prisma.repost.delete({
            where: {
                id: parsedData.data.repostId
            }
        });
        await prisma.tweet.update({
            where: {
                id: repostToBeDeleted.tweetId
            },
            data: {
                repostCount: {
                    decrement: 1
                }
            }
        });
        return res.status(200).json(new ApiResponse(200, DELETEREPOSTSUCCESSFUL, {}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    deleteRepost
}

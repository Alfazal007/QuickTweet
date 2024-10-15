import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { DELETEDREPLYSUCCESSFULLY, ISSUEWITHDATABASE, NOREQUESTBODY, REPLYNOTFOUND, UNAUTHORIZED, ZODERROR } from "../../constants/ReturnTypes";
import { deleteReplyType } from "../../zodTypes/zod.reply.delete";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const deleteReply = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    if(!req.user) {
        return res.status(401).json(new ApiError(401, UNAUTHORIZED, []));
    }
    const parsedData = deleteReplyType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    try {
        const replyToBeDeleted = await prisma.reply.findFirst({
            where: {
                id: parsedData.data.replyId
            }
        });
        if(!replyToBeDeleted) {
            return res.status(404).json(new ApiError(404, REPLYNOTFOUND, []));
        }
        if(replyToBeDeleted.creatorId != req.user.id) {
            return res.status(401).json(new ApiError(401, UNAUTHORIZED, []));
        }
        await prisma.reply.delete({
            where: {
                id: parsedData.data.replyId
            }
        });
        await prisma.tweet.update({
            where: {
                id: replyToBeDeleted.tweetId
            },
            data: {
                replyCount: {
                    decrement: 1
                }
            }
        });
        return res.status(200).json(new ApiResponse(200, DELETEDREPLYSUCCESSFULLY, {}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});


export {
    deleteReply
}

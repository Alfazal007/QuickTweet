import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { CREATEDNEWREPLY, ISSUEWITHDATABASE, NOREQUESTBODY, UNAUTHORIZED, ZODERROR } from "../../constants/ReturnTypes";
import { createReplyType } from "../../zodTypes/zod.reply.createReply";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const createReply = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    if(!req.user) {
        return res.status(401).json(new ApiError(401, UNAUTHORIZED, []));
    }
    const parsedData = createReplyType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    try {
        const newReply = await prisma.reply.create({
            data: {
                tweetId: parsedData.data.tweetId,
                description: parsedData.data.description,
                creatorId: req.user.id
            },
            select: {
                description: true,
                id: true,
                tweetId: true,
                creatorId: true
            }
        });
        await prisma.tweet.update({
            where: {
                id: parsedData.data.tweetId
            },
            data: {
                replyCount: {
                    increment: 1
                }
            }
        });
        return res.status(200).json(new ApiResponse(200, CREATEDNEWREPLY, newReply));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {createReply}

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ALREADYREPOSTED, CREATEDNEWREPOST, ISSUEWITHDATABASE, NOREQUESTBODY, USERNOTFOUND, ZODERROR } from "../../constants/ReturnTypes";
import { createAndDeleteRepostType } from "../../zodTypes/zod.repost.create";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const createRepost = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    if(!req.user) {
        return res.status(401).json(new ApiError(401, USERNOTFOUND, []));
    }
    const parsedData = createAndDeleteRepostType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    try {
        const isAlreadyReposted = await prisma.repost.findFirst({
            where: {
                AND: [
                    {
                        tweetId: parsedData.data.tweetId
                    },
                    {
                        creatorId: req.user.id
                    }
                ]
            }
        });
        if(isAlreadyReposted) {
            return res.status(400).json(new ApiError(400, ALREADYREPOSTED, []));
        }
        const createdRepost = await prisma.repost.create({
            data: {
                creatorId: req.user.id,
                tweetId: parsedData.data.tweetId,
            }, select: {
                tweetId: true,
                id: true
            }
        });
        await prisma.tweet.update({
            where: {
                id: parsedData.data.tweetId
            },
            data: {
                repostCount: {
                    increment: 1
                }
            }
        });
        return res.status(200).json(new ApiResponse(200, CREATEDNEWREPOST, createdRepost));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    createRepost
}

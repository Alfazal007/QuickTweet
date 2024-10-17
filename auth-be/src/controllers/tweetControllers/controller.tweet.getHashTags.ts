import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ISSUEWITHDATABASE, NODATAFOUND, NOREQUESTBODY, SUCCESSFULLYFETCHEDTHEDATA, ZODERROR } from "../../constants/ReturnTypes";
import { getByHashTagType } from "../../zodTypes/zod.tweet.getByHashtag";
import { prisma } from "../../constants/prisma";
import { client } from "../../constants/redisClient";
import { ApiResponse } from "../../utils/ApiResponse";
import { hashtagQueryExpiry } from "../../constants/constants";

const getHashTagByTweet = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    const parsedData = getByHashTagType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    let { page } = req.params;
    if(page == '0') {
        page = '1';
    }
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = 10;
    const skip = (pageNumber - 1) * limitNumber;
    try {
        if(!client.isOpen) {
            await client.connect();
        }
        const getTweetFromRedis = await client.get(parsedData.data.hashtag+pageNumber);
        if(getTweetFromRedis) {
            return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, JSON.parse(getTweetFromRedis)));
        }
        const getTweetsByHash = await prisma.tweet.findMany({
            where: {
                hashtags: {
                    has: parsedData.data.hashtag
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limitNumber,
            select: {
                createdAt: true,
                picture: true,
                description: true,
                hashtags: true,
                creatorId: true,
                replyCount: true,
                repostCount: true,
            }
        });
        if(getTweetsByHash && getTweetsByHash.length > 0) {
            await client.set(parsedData.data.hashtag+pageNumber, JSON.stringify(getTweetsByHash), {
                "EX": hashtagQueryExpiry
            });
            return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, getTweetsByHash));
        }
        return res.status(200).json(new ApiResponse(200, NODATAFOUND, []));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    getHashTagByTweet
}

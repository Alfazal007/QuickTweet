import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { INVALIDTWEETID, ISSUEWITHDATABASE, SUCCESSFULLYFETCHEDTHEDATA, TWEETNOTFOUND } from "../../constants/ReturnTypes";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";
import { client } from "../../constants/redisClient";
import { singleQueryExpiry } from "../../constants/constants";

const getTweet = asyncHandler(async(req: Request, res: Response) => {
    const { tweetId } = req.params;
    if(!tweetId) {
        return res.status(400).json(new ApiError(400, INVALIDTWEETID, []));
    }
    try {
        if(!client.isOpen) {
            await client.connect();
        }
        const tweetFromRedis = await client.get(tweetId);
        if(tweetFromRedis) {
            return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, JSON.parse(tweetFromRedis)));
        }
        const tweet = await prisma.tweet.findFirst({
            where: {
                id: tweetId
            },
            select: {
                id: true,
                picture: true,
                creatorId: true,
                description: true,
                createdAt: true,
                hashtags: true
            }
        });
        if(!tweet) {
            return res.status(400).json(new ApiError(400, TWEETNOTFOUND, []));
        }
        await client.set(tweetId, JSON.stringify(tweet), {
            "EX": singleQueryExpiry
        });
        return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, tweet));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});


export {
    getTweet
}

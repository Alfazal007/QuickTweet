import { Request, Response } from "express"
import { asyncHandler } from "../../utils/AsyncHandler"
import { ApiError } from "../../utils/ApiError";
import { INVALIDURL, ISSUEWITHDATABASE, SUCCESSFULLYFETCHEDTHEDATA, USERNOTFOUND } from "../../constants/ReturnTypes";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";
import { client } from "../../constants/redisClient";
import { singleQueryExpiry } from "../../constants/constants";

const getUserTweets = asyncHandler(async(req: Request, res: Response) => {
    let { username, page } = req.params;
    if(page == '0') {
        page = '1';
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = 10;

    const skip = (pageNumber - 1) * limitNumber;
    if(!username || !page) {
        return res.status(400).json(new ApiError(400, INVALIDURL, []));
    }
    try {
        if(!client.isOpen) {
            await client.connect();
        }
        const tweetsFromRedis = await client.get(`${username}+${skip}`);
        if(tweetsFromRedis) {
            return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, JSON.parse(tweetsFromRedis)));
        }
        const foundUserFromUsername = await prisma.user.findFirst({
            where: {
                username
            }
        });
        if(!foundUserFromUsername) {
            return res.status(404).json(new ApiError(404, USERNOTFOUND, []));
        }
        const tweets = await prisma.tweet.findMany({
            where: {
                creatorId: foundUserFromUsername.id
            },
            skip,
            take: limitNumber,
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                createdAt: true,
                creatorId: true,
                picture: true,
                replyCount: true,
                repostCount: true,
                description: true,
            }
        });
        if(tweets.length > 0) {
            await client.set(`${username}+${skip}`, JSON.stringify(tweets), {
                'EX': singleQueryExpiry
            });
        }
        return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, {tweets}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    getUserTweets
}

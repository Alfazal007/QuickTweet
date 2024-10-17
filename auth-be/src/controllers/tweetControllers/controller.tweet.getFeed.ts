import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ISSUEWITHDATABASE, SUCCESSFULLYFETCHEDTHEDATA, UNAUTHORIZED } from "../../constants/ReturnTypes";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const getFeed = asyncHandler(async(req: Request, res: Response) => {
    if(!req.user) {
        return res.status(401).json(new ApiError(401, UNAUTHORIZED, []));
    }
    try {
        let { page } = req.params;
        if(page == '0') {
            page = '1';
        }

        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = 10;

        const skip = (pageNumber - 1) * limitNumber;
        const peopleUserFollows = await prisma.follow.findMany({
            where: {
                followerId: {
                    in: [req.user.id]
                },
            },
            select: {
                followingId: true
            }
        });
        const peopleUserFollowsArray = peopleUserFollows.map((data) => data.followingId);
        peopleUserFollowsArray.push(req.user.id);
        if(peopleUserFollows.length == 0) {
            return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, {}));
        }
        const tweetsForFeed = await prisma.tweet.findMany({
            where: {
                creatorId: {
                    in: peopleUserFollowsArray
                }
            },
            skip,
            take: limitNumber,
            select: {
                creatorId: true,
                createdAt: true,
                id: true,
                picture: true,
                description: true,
                replyCount: true,
                repostCount: true,
                hashtags: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, tweetsForFeed));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    getFeed
}

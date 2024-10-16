import { Request, Response } from "express"
import { asyncHandler } from "../../utils/AsyncHandler"
import { ApiError } from "../../utils/ApiError";
import { INVALIDURL, ISSUEWITHDATABASE, SUCCESSFULLYFETCHEDTHEDATA } from "../../constants/ReturnTypes";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const getUserTweets = asyncHandler(async(req: Request, res: Response) => {
    const { userid, page, limit } = req.params;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const skip = (pageNumber - 1) * limitNumber;
    if(!userid || !page || !limit) {
        return res.status(400).json(new ApiError(400, INVALIDURL, []));
    }
    try {
        const tweets = await prisma.tweet.findMany({
            where: {
                creatorId: userid
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
        return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, {tweets}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    getUserTweets
}

import { Request, Response } from "express"
import { asyncHandler } from "../../utils/AsyncHandler"
import { ApiError } from "../../utils/ApiError";
import { ISSUEWITHDATABASE, NOREQUESTBODY, SUCCESSFULLYFETCHEDTHEDATA, ZODERROR } from "../../constants/ReturnTypes";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";
import { getReply } from "../../zodTypes/zod.reply.get";

const getTweetReply = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []))
    }

    const parsedData = getReply.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }

    const { tweetId, page, limit } = parsedData.data;

    const pageNumber = page;
    const limitNumber = limit;

    const skip = (pageNumber - 1) * limitNumber;
    try {
        const replies = await prisma.reply.findMany({
            where: {
                tweetId: tweetId
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
                description: true,
            }
        });
        return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFETCHEDTHEDATA, { replies }));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    getTweetReply
}

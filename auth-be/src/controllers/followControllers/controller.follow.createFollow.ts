import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { CANNOTFOLLOWYOURSELF, ISSUEWITHDATABASE, NOREQUESTBODY, SUCCESSFULLYFOLLOWING, UNAUTHORIZED, ZODERROR } from "../../constants/ReturnTypes";
import { createFollowType } from "../../zodTypes/zod.follow.createFollow";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const createFollow = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    if(!req.user) {
        return res.status(401).json(new ApiError(401, UNAUTHORIZED, []));
    }
    const userFollowing = req.user.id;
    const parsedData = createFollowType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    if(userFollowing == parsedData.data.userToBeFollowedId) {
        return res.status(400).json(new ApiError(400, CANNOTFOLLOWYOURSELF, []));
    }
    try {
        await prisma.follow.upsert({
            where: {
                followerId_followingId: {
                    followingId: parsedData.data.userToBeFollowedId,
                    followerId: userFollowing
                }
            },
            update: {},
            create: {
                followerId: userFollowing,
                followingId: parsedData.data.userToBeFollowedId
            }
        });
        return res.status(200).json(new ApiResponse(200, SUCCESSFULLYFOLLOWING, {}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    createFollow
}

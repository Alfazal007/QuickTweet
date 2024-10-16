import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ISSUEWITHDATABASE, NOREQUESTBODY, NOTFOLLOWING, SUCCESSFULLYUNFOLLOWING, ZODERROR } from "../../constants/ReturnTypes";
import { deleteFollowType } from "../../zodTypes/zod.follow.unfollow";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const deleteFollow = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    const parsedData = deleteFollowType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    try {
        const isFollowing = await prisma.follow.findFirst({
            where: {
                AND: [
                    {
                        followerId: req.user.id,
                    },
                    {
                        followingId: parsedData.data.userToBeUnFollowedId
                    }
                ]
            }
        });
        if(!isFollowing) {
            return res.status(400).json(new ApiError(400, NOTFOLLOWING, []));
        }
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followingId: parsedData.data.userToBeUnFollowedId,
                    followerId: req.user.id
                }
            }
        });
        return res.status(200).json(new ApiResponse(200, SUCCESSFULLYUNFOLLOWING, {}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});


export {
    deleteFollow
}

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { ISSUEWITHDATABASE, LOGGEDOUT, UNAUTHORIZED } from "../../constants/ReturnTypes";
import { prisma } from "../../constants/prisma";

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const userFound = req.user;
    if(!userFound) {
        return res.status(403).json(new ApiError(403, UNAUTHORIZED, []));
    }
    try {
        await prisma.user.update({
            where: {
                username: userFound.username
            },
            data: {
                refreshToken: ""
            }
        });
        return res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken").json(new ApiResponse(200, LOGGEDOUT, {}))
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    logoutUser
}

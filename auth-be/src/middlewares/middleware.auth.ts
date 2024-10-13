import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { UNAUTHORIZED, USERNOTFOUND } from "../constants/ReturnTypes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVariables } from "../config/envLoader";
import { prisma } from "../constants/prisma";

interface User {
    id: string;
    username: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

const authMiddleware = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if(!accessToken && !refreshToken) {
        return res
            .status(403)
            .json(new ApiError(403, UNAUTHORIZED, []));
    }
    let userInfo;
    try {
        if(accessToken) {
            userInfo = jwt.verify(
                accessToken,
                envVariables.accessTokenSecret || ""
            ) as JwtPayload;
        } else {
            userInfo = jwt.verify(
                refreshToken,
                envVariables.refreshTokenSecret || ""
            ) as JwtPayload;
        }
    } catch (error) {
        return res.status(403).json(new ApiError(403, UNAUTHORIZED, []));
    }
    const userOfThisToken = await prisma.user.findFirst({
        where: {
            AND: [{ id: userInfo.id }, { username: userInfo.username }],
        },
        select: {
            id: true,
            username: true,
            email: true,
            refreshToken: true
        },
    });

    if (!userOfThisToken) {
        return res
            .status(403)
            .json(
                new ApiError(
                    403,
                    USERNOTFOUND
                )
            );
    }
    if(refreshToken && userOfThisToken.refreshToken != refreshToken) {
        return res
            .status(403)
            .json(
                new ApiError(
                    403,
                    USERNOTFOUND
                )
            );
    }
    req.user = userOfThisToken;
    return next();
});


export {
    authMiddleware
}

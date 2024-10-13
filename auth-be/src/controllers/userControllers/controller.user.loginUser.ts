import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ISSUEWITHDATABASE, NOREQUESTBODY, PASSWORDINVALID, SUCCESSFULLYLOGGEDIN, USERNOTFOUND, USERNOTVERIFIED, VERIFIEDUSER, ZODERROR } from "../../constants/ReturnTypes";
import { loginUserType } from "../../zodTypes/zod.user.login";
import { prisma } from "../../constants/prisma";
import { isPasswordCorrect } from "../../helpers/HashPassword";
import jwt from "jsonwebtoken";
import { envVariables } from "../../config/envLoader";
import { ApiResponse } from "../../utils/ApiResponse";

const loginUser = asyncHandler(async(req: Request, res: Response)=> {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    const parsedData = loginUserType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    try {
        const userTryingToLogin = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: parsedData.data.username
                    },
                    {
                        email: parsedData.data.username
                    }
                ]
            }
        });
        if(!userTryingToLogin) {
            return res.status(400).json(new ApiError(400, USERNOTFOUND, []));
        }
        if(!userTryingToLogin.isVerified) {
            return res.status(400).json(new ApiError(400, USERNOTVERIFIED, []));
        }
        const isValidPassword = await isPasswordCorrect(parsedData.data.password, userTryingToLogin.password);
        if(!isValidPassword) {
            return res.status(400).json(new ApiError(400, PASSWORDINVALID, []));
        }
        const accessToken = jwt.sign
        (
            {
                id: userTryingToLogin.id,
                username: userTryingToLogin.username,
            },
            envVariables.accessTokenSecret || "", {
                expiresIn: envVariables.accessTokenExpiry
            }
        );
        const refreshToken = jwt.sign
        (
            {
                id: userTryingToLogin.id,
                username: userTryingToLogin.username,
                email: userTryingToLogin.email,
            },
            envVariables.refreshTokenSecret || "", {
                expiresIn: envVariables.refreshTokenExpiry
            }
        );
        try {
            await prisma.user.update({
                where: {
                    username: userTryingToLogin.username
                },
                data: {
                    refreshToken
                }
            });
        } catch(err) {
            return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, SUCCESSFULLYLOGGEDIN, {}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});


export {
    loginUser
}

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { INVALIDOTP, ISSUEWITHDATABASE, NOREQUESTBODY, USERNOTFOUND, VERIFIEDUSER, ZODERROR } from "../../constants/ReturnTypes";
import { ApiError } from "../../utils/ApiError";
import { verifyUserType } from "../../zodTypes/zod.user.verify";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const verifyUser = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    const parsedData = verifyUserType.safeParse(req.body);
    if(!parsedData.success) {
        const zodErrors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], zodErrors))
    }
    try {
        const userFromDataBase = await prisma.user.findFirst({
            where: {
                username: parsedData.data.username
            }
        });
        if(!userFromDataBase) {
            return res.status(400).json(new ApiError(400, USERNOTFOUND, []));
        }
        if(userFromDataBase.otp != parsedData.data.otp) {
            return res.status(400).json(new ApiError(400, INVALIDOTP, []));
        }
        try {
            await prisma.user.update({
                where: {
                    username: parsedData.data.username
                },
                data: {
                    isVerified: true
                }
            });
            return res.status(200).json(new ApiResponse(200, VERIFIEDUSER, {}));
        } catch(err) {
            return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []))
        }
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []))
    }
});

export {
    verifyUser
}

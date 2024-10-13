import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ISSUEWITHDATABASE, PASSWORDINVALID, PASSWORDUPDATEDSUCCESSFULLY, USERNOTFOUND, ZODERROR } from "../../constants/ReturnTypes";
import { hashPassword, isPasswordCorrect } from "../../helpers/HashPassword";
import { updatePasswordType } from "../../zodTypes/zod.user.updatePassword";
import { prisma } from "../../constants/prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const updatePassword = asyncHandler(async(req: Request, res: Response) => {
    if(!req.user) {
        return res.status(400).json(new ApiError(400, USERNOTFOUND, []))
    }
    const parsedData = updatePasswordType.safeParse(req.body);
    if(!parsedData.success) {
        const errors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], errors));
    }
    try {
        const isPasswordValid = await isPasswordCorrect(parsedData.data.oldPassword, req.user.password);
        if(!isPasswordValid) {
            return res.status(400).json(new ApiError(400, PASSWORDINVALID, []));
        }
        const newPasswordHashed = await hashPassword(parsedData.data.newPassword);
        await prisma.user.update({
            where: {
                username: req.user.username
            },
            data: {
                password: newPasswordHashed
            }
        });
        return res.status(200).json(new ApiResponse(200, PASSWORDUPDATEDSUCCESSFULLY, {}));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []));
    }
});

export {
    updatePassword
}

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { ISSUEWITHDATABASE, NOREQUESTBODY, SUCCESSFULUSERCREATED, UNIQUEEMAILCONSTRAINTVIOLATION, UNIQUEUSERNAMECONSTRAINTVIOLATION, ZODERROR } from "../../constants/errorTypes";
import { createUserType } from "../../zodTypes/zod.user.create";
import { prisma } from "../../constants/prisma";
import { hashPassword } from "../../helpers/HashPassword";
import { generateRandomNumber } from "../../helpers/RandomNumber";
import { sendMail } from "../../helpers/SendEmail";

const createUser = asyncHandler(async(req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).json(new ApiError(400, NOREQUESTBODY, []));
    }
    const parsedData = createUserType.safeParse(req.body);
    if(!parsedData.success) {
        const zodErrors = parsedData.error.errors.map((err) => err.message);
        return res.status(400).json(new ApiError(400, ZODERROR, [], zodErrors));
    }
    try {
        const checkUniquenessInDatabase = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: parsedData.data.username
                    },
                    {
                        email: parsedData.data.email
                    },
                ]
            }
        });
        if(checkUniquenessInDatabase) {
            if(checkUniquenessInDatabase.username == parsedData.data.username) {
                return res.status(400).json(new ApiError(400, UNIQUEUSERNAMECONSTRAINTVIOLATION, []));
            }
            return res.status(400).json(new ApiError(400, UNIQUEEMAILCONSTRAINTVIOLATION, []));
        }
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []))
    }
    const randomNumber = generateRandomNumber();
    const hashedPassword = await hashPassword(parsedData.data.password);
    try {
        const newUser = await prisma.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                email: parsedData.data.email,
                otp: randomNumber.toString()
            },
            select: {
                username: true,
                email: true,
                id: true,
                createdAt: true
            }
        });
        await sendMail(newUser.email, randomNumber.toString(), newUser.username);
        return res.status(200).json(new ApiResponse(200, SUCCESSFULUSERCREATED, newUser));
    } catch(err) {
        return res.status(400).json(new ApiError(400, ISSUEWITHDATABASE, []))
    }
});

export { createUser }

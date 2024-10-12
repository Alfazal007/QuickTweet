import { z } from "zod";

const verifyUserType = z.object({
    username: z.string({message: "Username not provided"}).min(6, "Minimum length of username should be 6").max(20, "The maximum length of username should be 20"),
    otp: z.string({message: "OTP not provided"}).length(6, "Length of OTP should be 6")
});

export {
    verifyUserType
}

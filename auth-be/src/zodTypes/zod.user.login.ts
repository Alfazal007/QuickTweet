import {z} from "zod";

const loginUserType = z.object({
    username: z.string({message: "Username or email not provided"}),
    password: z.string({message: "Password not provided"}).min(6, "Minimum length of password should be 6").max(20, "The maximum length of password should be 20"),
});

export {loginUserType};

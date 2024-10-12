import {z} from "zod";

const createUserType = z.object({
    username: z.string({message: "Username not provided"}).min(6, "Minimum length of username should be 6").max(20, "The maximum length of username should be 20"),
    email: z.string({message: "Email not provided"}).email({message: "Invalid email provided"}),
    password: z.string({message: "Password not provided"}).min(6, "Minimum length of password should be 6").max(20, "The maximum length of password should be 20"),
});

export {createUserType};

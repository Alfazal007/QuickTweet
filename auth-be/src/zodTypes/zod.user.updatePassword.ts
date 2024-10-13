import {z} from "zod";

const updatePasswordType = z.object({
    oldPassword: z.string({message: "Old password not provided"}).min(6, "Minimum length of old password should be 6").max(20, "The maximum length of old password should be 20"),
    newPassword: z.string({message: "New password not provided"}).min(6, "Minimum length of new password should be 6").max(20, "The maximum length of new password should be 20"),
});

export {updatePasswordType};

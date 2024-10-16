import {z} from "zod";

const deleteFollowType = z.object({
    userToBeUnFollowedId: z.string({message: "User Id to be unfollowed not given"})
});

export { deleteFollowType };

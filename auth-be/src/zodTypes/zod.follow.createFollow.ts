import {z} from "zod";

const createFollowType = z.object({
    userToBeFollowedId: z.string({message: "User Id to be followed not given"})
});

export { createFollowType };

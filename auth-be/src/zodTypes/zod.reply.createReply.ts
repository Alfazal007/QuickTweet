import {z} from "zod";

const createReplyType = z.object({
    tweetId: z.string({message: "Tweet Id for the tweet to be reposted not provided"}).min(1, "Atleast should be of length 1"),
    description: z.string({message: "Content not provided for the reply"}),
});

export { createReplyType };


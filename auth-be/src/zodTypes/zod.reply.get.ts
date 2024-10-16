import {z} from "zod";

const getReply = z.object({
    tweetId: z.string({message: "Tweet Id for the tweet to be reposted not provided"}),
    page: z.number({message: "Page number not given"}),
    limit: z.number({message: "Page number not given"})
});

export { getReply };

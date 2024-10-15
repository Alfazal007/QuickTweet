import {z} from "zod";

const createAndDeleteRepostType = z.object({
    tweetId: z.string({message: "Tweet Id for the tweet to be reposted not provided"})
});

export {createAndDeleteRepostType};

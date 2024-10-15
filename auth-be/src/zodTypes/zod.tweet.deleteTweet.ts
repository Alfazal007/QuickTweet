import {z} from "zod";

const deleteTweetType = z.object({
    tweetId: z.string({message: "Tweet Id for the tweet to be deleted not provided"})
});

export {deleteTweetType};

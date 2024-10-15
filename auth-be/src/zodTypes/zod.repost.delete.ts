import {z} from "zod";

const deleteRepostType = z.object({
    repostId: z.string({message: "Tweet Id for the tweet to be reposted not provided"})
});

export {deleteRepostType};

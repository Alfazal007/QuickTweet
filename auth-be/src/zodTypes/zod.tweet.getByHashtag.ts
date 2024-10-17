import {z} from "zod";

const getByHashTagType = z.object({
    hashtag: z.string({message: " Hashtag to search against not provided"}).min(1, {message: "The minimum length is 1"})
});

export { getByHashTagType };

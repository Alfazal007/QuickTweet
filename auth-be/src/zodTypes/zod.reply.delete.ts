import {z} from "zod";

const deleteReplyType = z.object({
    replyId: z.string({message: "Reply id for the reply to be deleted not provided"})
});

export { deleteReplyType };

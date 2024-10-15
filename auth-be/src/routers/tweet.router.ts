import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.auth";
import { upload } from "../middlewares/middleware.multer";
import { createTweet } from "../controllers/tweetControllers/controller.tweet.create";
import { deleteTweetController } from "../controllers/tweetControllers/controller.tweet.delete";
const tweetRouter = Router();

tweetRouter.route("/create").post(authMiddleware, upload.single("tweetPic"), createTweet);
tweetRouter.route("/delete").delete(authMiddleware, deleteTweetController);

export {
   tweetRouter 
}

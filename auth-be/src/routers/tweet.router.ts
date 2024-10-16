import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.auth";
import { upload } from "../middlewares/middleware.multer";
import { createTweet } from "../controllers/tweetControllers/controller.tweet.create";
import { deleteTweetController } from "../controllers/tweetControllers/controller.tweet.delete";
import { getUserTweets } from "../controllers/tweetControllers/controller.tweet.getUserTweets";
import { getTweet } from "../controllers/tweetControllers/controller.tweet.getTweet";
const tweetRouter = Router();

tweetRouter.route("/create").post(authMiddleware, upload.single("tweetPic"), createTweet);
tweetRouter.route("/delete").delete(authMiddleware, deleteTweetController);
tweetRouter.route("/user/:userid/page/:page/limit/:limit").get(authMiddleware, getUserTweets);
tweetRouter.route("/get/tweetId/:tweetId").get(authMiddleware, getTweet);

export {
   tweetRouter 
}

import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.auth";
import { upload } from "../middlewares/middleware.multer";
import { createTweet } from "../controllers/tweetControllers/controller.tweet.create";
import { deleteTweetController } from "../controllers/tweetControllers/controller.tweet.delete";
import { getUserTweets } from "../controllers/tweetControllers/controller.tweet.getUserTweets";
import { getTweet } from "../controllers/tweetControllers/controller.tweet.getTweet";
import { getFeed } from "../controllers/tweetControllers/controller.tweet.getFeed";
import { getHashTagByTweet } from "../controllers/tweetControllers/controller.tweet.getHashTags";
const tweetRouter = Router();

tweetRouter.route("/create").post(authMiddleware, upload.single("tweetPic"), createTweet);
tweetRouter.route("/delete").delete(authMiddleware, deleteTweetController);
tweetRouter.route("/user/:username/page/:page").get(authMiddleware, getUserTweets);
tweetRouter.route("/get/tweetId/:tweetId").get(authMiddleware, getTweet);
tweetRouter.route("/feed/page/:page").get(authMiddleware, getFeed);
tweetRouter.route("/hashtag/page/:page").get(authMiddleware, getHashTagByTweet);

export {
   tweetRouter 
}

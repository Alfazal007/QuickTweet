import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.auth";
import { upload } from "../middlewares/middleware.multer";
import { createTweet } from "../controllers/tweetControllers/controller.tweet.create";
const tweetRouter = Router();

tweetRouter.route("/create").post(authMiddleware, upload.single("tweetPic"), createTweet);

export {
   tweetRouter 
}

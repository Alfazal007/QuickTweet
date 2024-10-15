import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.auth";
import { createRepost } from "../controllers/repostController/controller.repost.create";
const repostRouter = Router();

repostRouter.route("/create").post(authMiddleware, createRepost);

export {
   repostRouter 
}

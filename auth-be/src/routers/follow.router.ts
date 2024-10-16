import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.auth";
import { createFollow } from "../controllers/followControllers/controller.follow.createFollow";
import { deleteFollow } from "../controllers/followControllers/controller.follow.deleteFollow";
const followRouter = Router();

followRouter.route("/create").post(authMiddleware, createFollow);
followRouter.route("/delete").post(authMiddleware, deleteFollow);

export {
   followRouter
}

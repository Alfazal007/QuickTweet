import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.auth";
import { createReply } from "../controllers/replyControllers/controller.reply.create";
import { deleteReply } from "../controllers/replyControllers/controller.reply.delete";
const replyRouter = Router();

replyRouter.route("/create").post(authMiddleware, createReply);
replyRouter.route("/delete").post(authMiddleware, deleteReply);

export {
   replyRouter 
}

import { Router } from "express";
import { createUser } from "../controllers/userControllers/controller.user.create";

const userRouter = Router();

userRouter.route("/create-user").post(createUser)

export {
    userRouter
}

import { Router } from "express";
import { createUser } from "../controllers/userControllers/controller.user.create";
import { verifyUser } from "../controllers/userControllers/controller.user.verify";
import { loginUser } from "../controllers/userControllers/controller.user.loginUser";
import { authMiddleware } from "../middlewares/middleware.auth";
import { logoutUser } from "../controllers/userControllers/controller.user.logout";

const userRouter = Router();

userRouter.route("/create-user").post(createUser);
userRouter.route("/verify-user").post(verifyUser);
userRouter.route("/login-user").post(loginUser);
userRouter.route("/logout").post(authMiddleware, logoutUser);

export {
    userRouter
}

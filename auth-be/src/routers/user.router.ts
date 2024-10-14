import { Router } from "express";
import { createUser } from "../controllers/userControllers/controller.user.create";
import { verifyUser } from "../controllers/userControllers/controller.user.verify";
import { loginUser } from "../controllers/userControllers/controller.user.loginUser";
import { authMiddleware } from "../middlewares/middleware.auth";
import { logoutUser } from "../controllers/userControllers/controller.user.logout";
import { updatePassword } from "../controllers/userControllers/controller.user.updatePassword";
import { upload } from "../middlewares/middleware.multer";
import { updateProfilePic } from "../controllers/userControllers/controller.user.addProfilePic";
import { removeProfilePic } from "../controllers/userControllers/controller.user.removeProfilePic";

const userRouter = Router();

userRouter.route("/create-user").post(createUser);
userRouter.route("/verify-user").post(verifyUser);
userRouter.route("/login-user").post(loginUser);
userRouter.route("/logout").post(authMiddleware, logoutUser);
userRouter.route("/change-password").put(authMiddleware, updatePassword);
userRouter.route("/change-profile-pic").put(authMiddleware, upload.single("profilePic"), updateProfilePic);
userRouter.route("/remove-profile-pic").delete(authMiddleware, removeProfilePic);

export {
    userRouter
}

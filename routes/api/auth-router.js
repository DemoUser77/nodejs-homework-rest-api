import express from "express";
import usersSchemas from "../../schemas/users-schemas.js";
import { validateBody } from "../../decorators/index.js";
import  authenticate  from "../../middlewares/authenticate.js";
import { authController } from "../../controllers/index.js";
import { upload } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(usersSchemas.userRegisterSchema), authController.register);
authRouter.post("/login", validateBody(usersSchemas.userLoginSchema), authController.login);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.patch("/avatars", authenticate, upload.single('avatar'),  authController.registerAvatar);


export default authRouter;
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router()


router.route("/register").post(
    upload.fields([
        {
            name: "profileImg",
            maxCount : 1,
        },
    ]),
    registerUser
)
router.route("/login").post(loginUser)


export default router
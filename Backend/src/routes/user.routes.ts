import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, updateAccountDetails, getCurrentUser } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import multer from "multer";

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

//secured routes
router.route("/logout").post(verifyJWT ,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-details").post(verifyJWT, updateAccountDetails)
router.route("/get-user").get(verifyJWT, getCurrentUser)






export default router
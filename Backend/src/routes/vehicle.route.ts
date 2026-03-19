import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { vehicleEntry, vehicleExit } from "../controllers/vehicle.controller";

const router = Router()


router.route("/entry/:bookingId").post(verifyJWT, vehicleEntry)
router.route("/exit/:bookingId").post(verifyJWT, vehicleExit)

export default router
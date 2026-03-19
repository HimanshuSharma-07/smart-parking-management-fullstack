import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createBooking, getUserBooking, cancelBooking, compeleteBooking } from "../controllers/booking.controller";


const router =  Router()

router.route("/parking-slots/:slotId/booking").post(verifyJWT, createBooking)
router.route("/my-bookings").get(verifyJWT, getUserBooking)
router.route("/:bookingId/complete").patch(verifyJWT, compeleteBooking)
router.route("/:bookingId/cancel").patch(verifyJWT, cancelBooking)


export default router
import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";
import {
    getDashboardStats,
    getAllBookings,
    getAllCustomerRecords,
    getAllPayments,
    getAllSlots
} from "../controllers/admin.controller";

const router = Router();

// Secure all admin routes
router.use(verifyJWT, verifyAdmin);

router.route("/stats").get(getDashboardStats);
router.route("/bookings").get(getAllBookings);
router.route("/customer-records").get(getAllCustomerRecords);
router.route("/payments").get(getAllPayments);
router.route("/slots").get(getAllSlots);

export default router;

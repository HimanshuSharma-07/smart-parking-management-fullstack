import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    createParkingSlot,
    createBulkParkingSlots,
    getAllParkingSlots,
    getParkingSlotById,
    getAvailableSlots,
    updateSlotStatus,
    updateParkingSlotDetails,
    deleteParkingSlot
} from "../controllers/parkingSlots.controller";

const router = Router()


router.post("/:lotId/slots", verifyJWT, createParkingSlot)
router.post("/:lotId/slots/bulk", verifyJWT, createBulkParkingSlots)

router.get("/:lotId/slots", verifyJWT, getAllParkingSlots)
router.get("/:lotId/slots/available", verifyJWT, getAvailableSlots)
router.get("/slots/:slotId", verifyJWT, getParkingSlotById)


router.patch("/slots/:slotId/status", verifyJWT, updateSlotStatus)
router.patch("/slots/:slotId", verifyJWT, updateParkingSlotDetails)

router.delete("/slots/:slotId", verifyJWT, deleteParkingSlot)

export default router
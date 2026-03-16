import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createParkingSlot, createBulkParkingSlots, getAllParkingSlots, getParkingSlotById, getAvailableSlots, updateSlotStatus, updateParkingSlotDetails,deleteParkingSlot } from "../controllers/parkingSlots.controller";



const router = Router()

router.route("/:id/create-parking-slot").post(verifyJWT, createParkingSlot)
router.route("/:id/create-parking-slots").post(verifyJWT, createBulkParkingSlots)
router.route("/:id/all-parking-slots").get(verifyJWT, getAllParkingSlots)
router.route("/:lotId/parking-slot/:slotId").get(verifyJWT, getParkingSlotById)
router.route("/:id/available-parking-slots").get(verifyJWT, getAvailableSlots)
router.route("/:lotId/parking-slot/:slotId/status").patch(verifyJWT, updateSlotStatus)
router.route("/:lotId/parking-slot/:slotId/details").patch(verifyJWT, updateParkingSlotDetails)
router.route("/:lotId/parking-slot/:slotId/delete").delete(verifyJWT, deleteParkingSlot)


export default router
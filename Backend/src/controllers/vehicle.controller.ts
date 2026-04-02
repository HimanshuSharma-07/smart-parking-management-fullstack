import { Booking } from "../models/bookig.model";
import { ParkingSlots } from "../models/parkingSlots.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { emitToLot, emitToAdmin } from "../sockets/socket";



const vehicleEntry = asyncHandler(async (req: Request, res: Response) => {

    const { bookingId } = req.params

    const booking = await Booking.findById(bookingId)

    if (!booking) {
        throw new ApiError(404, "Booking not found")
    }

    if (booking.bookingStatus === "completed" || booking.bookingStatus === "cancelled") {
        throw new ApiError(400, "Booking is not valid for entry")
    }

    const slot = await ParkingSlots.findById(booking.slotId)

    if (!slot) {
        throw new ApiError(404, "Parking slot not found")
    }

    if (slot.status !== "occupied") {
        throw new ApiError(400, "Slot is not occupied")
    }

    slot.status = "occupied"
    await slot.save()

    booking.bookingStatus = "active"
    await booking.save()

    // Real-time: push slot update to lot room
    const lotId = slot.lotId?.toString()
    if (lotId) {
        emitToLot(lotId, "slot:statusUpdate", {
            slotId: slot._id.toString(),
            status: "occupied",
            lotId,
        })
    }
    emitToAdmin("booking:updated", { bookingId, status: "active", lotId })

    return res.status(200).json(
        new ApiResponse(200, slot, "Vehicle entered parking")
    )
})



const vehicleExit = asyncHandler(async (req: Request, res: Response) => {

    const { bookingId } = req.params

    const booking = await Booking.findById(bookingId)

    if (!booking) {
        throw new ApiError(404, "Booking not found")
    }

    if (booking.bookingStatus === "completed") {
        throw new ApiError(400, "Booking already completed")
    }

    const slot = await ParkingSlots.findById(booking.slotId)

    if (!slot) {
        throw new ApiError(404, "Parking slot not found")
    }

    const endTime = new Date()

    const hours = Math.ceil(
        (endTime.getTime() - booking.startTime.getTime()) /
        (1000 * 60 * 60)
    )

    const totalPrice = hours * (slot.pricePerHour || 0)

    booking.endTime = endTime
    booking.bookingStatus = "completed"

    await booking.save()

    slot.status = "available"
    await slot.save()

    // Real-time: push slot freed + booking completed to relevant rooms
    const lotId = slot.lotId?.toString()
    if (lotId) {
        emitToLot(lotId, "slot:statusUpdate", {
            slotId: slot._id.toString(),
            status: "available",
            lotId,
        })
    }
    emitToAdmin("booking:completed", { bookingId, lotId, slotId: slot._id.toString() })

    return res.status(200).json(
        new ApiResponse(
            200,
            { hours, totalPrice },
            "Vehicle exited successfully"
        )
    )
})

export {
    vehicleEntry,
    vehicleExit
}
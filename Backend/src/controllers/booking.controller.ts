import { Booking } from "../models/bookig.model";
import { ParkingLots } from "../models/parkingLot.model";
import { ParkingSlots } from "../models/parkingSlots.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";


const createBooking = asyncHandler( async (req: Request, res: Response) => {
        
    const { slotId } = req.params

    const userId = req.user?._id

    const { vehicleNumber, startTime, endTime} = req.body

    if (!vehicleNumber || !startTime || !endTime) {
        throw new ApiError(400, "All fields are required")
    }

    const parkingSlot = await ParkingSlots.findById(slotId)

    if (!parkingSlot) {
        throw new ApiError(400, "No available slots")
    }

    const existingBooking = await Booking.findOne({
        slotId: parkingSlot._id,
        bookingStatus: { $in: ["active", "reserved"] },
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
    })
    
    if (existingBooking) {
         throw new ApiError(409, "Parking slot already booked for this time")
    }

    const booking = await Booking.create({
        userId,
        slotId,
        vehicleNumber,
        startTime,
        endTime,
        bookingStatus: "active"
        
    })

    parkingSlot.status = "reserved"
    await parkingSlot.save()

    return res
    .status(200)
    .json(
        new ApiResponse(201, booking, "Booking created Successfully")
    )

})

const getUserBooking = asyncHandler( async (req: Request, res: Response) => {

    const userBookings = await Booking.find({
        userId: req.user?._id,
    }).populate("slotId")

    return res
    .status(200)
    .json(
        new ApiResponse(200, userBookings, "User Booking fetched Successfully")
    )
})

const compeleteBooking = asyncHandler(async (req: Request, res: Response) => {
    
    const { bookingId } = req.params

    const userBooking = await Booking.findById(bookingId)

    if (!userBooking) {
        throw new ApiError(404, "Booking not found")
    }

    const parkingSlot = await ParkingSlots.findById(userBooking.slotId)

    if (!parkingSlot) {
        throw new ApiError(404, "Parking slot not found")
    }

    const endTime = new Date()

    
    if (endTime < userBooking.startTime) {
        throw new ApiError(400, "Booking has not started yet")
    }

    const durationMs = endTime.getTime() - userBooking.startTime.getTime()

    const hours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)))

    const totalPrice = hours * (parkingSlot.pricePerHour || 0)

    userBooking.endTime = endTime
    userBooking.bookingStatus = "completed"

    await userBooking.save()

    parkingSlot.status = "available"
    await parkingSlot.save()

    return res.status(200).json(
        new ApiResponse(200, { hours, totalPrice }, "Booking completed successfully")
    )
})

const cancelBooking = asyncHandler( async (req: Request, res: Response) => {

    const { bookingId } = req.params

    const userBooking = await Booking.findById(bookingId)

    if (!userBooking) {
        throw new ApiError(404, "User Booking not found")
    }

    userBooking.bookingStatus = "cancelled"
    await userBooking.save()

    const updatedParkingSlot = await ParkingSlots.findByIdAndUpdate(
        userBooking.slotId,
        {
            status: "available"
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedParkingSlot, "User Booking Cancelled")
    )
    
})

   


export {
    createBooking,
    getUserBooking,
    compeleteBooking,
    cancelBooking

}
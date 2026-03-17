import { ParkingLots } from "../models/parkingLot.model";
import { ParkingSlots } from "../models/parkingSlots.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const createParkingSlot = asyncHandler ( async (req: Request, res: Response) => {

    const {lotId } = req.params
    const { slotNumber, floor, type, pricePerHour } = req.body


    const parkingLot = await ParkingLots.findById(lotId)

    if (!parkingLot) {
        throw new ApiError(404, "Parking Lot not found")
    }

    if(!slotNumber || !floor || !type ){
        throw new ApiError(400, "All fields are required")
    } 

    if (pricePerHour && pricePerHour < 0) {
        throw new ApiError(400, "Price per hour must be positive")
    }

    const existingSlot = await ParkingSlots.findOne({
        slotNumber,
        lotId
    })

    if (existingSlot) {
        throw new ApiError(409, "Slot number already exists in this parking lot")
    }
    
    const createdParkingSlot = await ParkingSlots.create({
        slotNumber,
        floor,
        type,
        status: "available",
        pricePerHour,
        lotId
    })
    
    return res
    .status(201)
    .json(
        new ApiResponse(201, createdParkingSlot, "Parking Slot created Successfully")
    )
})

const createBulkParkingSlots = asyncHandler(async (req: Request, res: Response) => {

    const { lotId } = req.params
    const { floors, slotsPerFloor, type, pricePerHour } = req.body

    const parkingLot = await ParkingLots.findById(lotId)

    if (!parkingLot) {
        throw new ApiError(404, "Parking lot not found")
    }

    if (!floors || !slotsPerFloor) {
        throw new ApiError(400, "Floors and slotsPerFloor are required")
    }

    if (floors <= 0 || slotsPerFloor <= 0) {
        throw new ApiError(400, "Floors and slotsPerFloor must be greater than 0")
    }

    if (pricePerHour && pricePerHour < 0) {
        throw new ApiError(400, "Price per hour must be positive")
    }

    // Find last created floor
    const lastSlot = await ParkingSlots
        .findOne({ lotId })
        .sort({ floor: -1 })

    const startFloor = lastSlot ? (lastSlot.floor as number) + 1 : 1

    const slots = []

    for (let floor = startFloor; floor < startFloor + floors; floor++) {
        for (let slot = 1; slot <= slotsPerFloor; slot++) {
            slots.push({
                slotNumber: `F${floor}-A${slot}`,
                floor,
                type,
                status: "available",
                pricePerHour,
                lotId
            })
        }
    }

    const createdSlots = await ParkingSlots.insertMany(slots)

    return res.status(201).json(
        new ApiResponse(201, createdSlots, "Parking slots created successfully")
    )
})
const getAllParkingSlots = asyncHandler( async (req: Request, res: Response) => {
    
    const { lotId } = req.params

    const parkingSlots = await ParkingSlots
        .find({ lotId })
        .sort({ createdAt: -1 })

    return res
    .status(200)
    .json(
        new ApiResponse(200, parkingSlots, "Parking slots fetched Succesfully")
    )
})

const getParkingSlotById = asyncHandler( async (req: Request, res: Response) => {
    
    const { slotId } = req.params

    const parkingSlot = await ParkingSlots.findById(slotId)

    if (!parkingSlot) {
        throw new ApiError(404, 'Parking slot not found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, parkingSlot, "Parking slot fetched Successfully")
    )
})

const getAvailableSlots = asyncHandler(async (req: Request, res: Response) => {

    const { lotId } = req.params

    const parkingLot = await ParkingLots.findById(lotId)

    if (!parkingLot) {
        throw new ApiError(404, "Parking lot not found")
    }

    const parkingSlots = await ParkingSlots.find({
        lotId,
        status: "available"
    }).sort({ slotNumber : 1})

    return res.status(200).json(
        new ApiResponse(200, parkingSlots, "Available slots fetched")
    )
})

const updateSlotStatus = asyncHandler(async (req: Request, res: Response) => {

    const { slotId } = req.params
    const { status } = req.body

    const allowedStatus = ["available", "occupied", "reserved", "maintenance"]

    if (!allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid slot status")
    }

    const parkingSlot = await ParkingSlots.findById(slotId)

    if (!parkingSlot) {
        throw new ApiError(404, "Parking slot not found")
    }

    if (parkingSlot.status === status) {
        return res.status(200).json(
            new ApiResponse(200, parkingSlot, "Slot already in this status")
        )
    }

    const previousStatus = parkingSlot.status
    

    parkingSlot.status = status
    await parkingSlot.save()

    if (previousStatus === "available" && status !== "available") {
        await ParkingLots.findByIdAndUpdate(parkingSlot.lotId, {
            $inc: { availableSlots: -1 }
        })
    }

    if (previousStatus !== "available" && status === "available") {
        await ParkingLots.findByIdAndUpdate(parkingSlot.lotId, {
            $inc: { availableSlots: 1 }
        })
    }

    return res.status(200).json(
        new ApiResponse(200, parkingSlot, "Slot status updated successfully")
    )
})

const updateParkingSlotDetails = asyncHandler( async (req: Request, res: Response) => {
    
    const { slotId } = req.params
    const {slotNumber, floor, type, pricePerHour} = req.body

    if (!slotNumber && !floor && !type && !pricePerHour) {
        throw new ApiError(400, " At least one field is required to update")
    }

    const updatedParkingSlot = await ParkingSlots.findByIdAndUpdate(
            slotId,
            {
                $set:{
                    slotNumber,
                    floor,
                    type,
                    pricePerHour
                }
            },
            {new: true}
    )
    
    if (!updatedParkingSlot) {
        throw new ApiError(404, "Parking slot not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedParkingSlot, "Parking slot details updated Successfully")
    )

})

const deleteParkingSlot = asyncHandler ( async (req: Request, res: Response) => {
    
    const { slotId } = req.params

    const deletedParkingSlot = await ParkingSlots.findByIdAndDelete(slotId)

    if (!deletedParkingSlot) {
        throw new ApiError(404, "Parking slot not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Parking slot deleted Successfully")
    )
})

export {
    createParkingSlot,
    createBulkParkingSlots,
    getAllParkingSlots,
    getParkingSlotById,
    getAvailableSlots,
    updateSlotStatus,
    updateParkingSlotDetails,
    deleteParkingSlot

}
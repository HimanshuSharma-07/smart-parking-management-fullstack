import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { uploadOnCloudinary } from "../utils/cloudinary"
import { ParkingLots } from "../models/parkingLot.model"

const createParkingLot = asyncHandler(async (req: Request, res: Response) => {
    const { lotName, address, totalSlots } = req.body

    if ([lotName, address, totalSlots].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const parkingLotImgLocalPath = req.file?.path

    if (!parkingLotImgLocalPath) {
        throw new ApiError(400, "Parking lot image is required")
    }

    const uploadedParkingLotImg = await uploadOnCloudinary(parkingLotImgLocalPath)

    if (!uploadedParkingLotImg?.url) {
        throw new ApiError(500, "Failed to upload parking lot image")
    }

    const parkingLot = await ParkingLots.create({
        lotName,
        address,
        parkingLotImg: uploadedParkingLotImg.url,
        totalSlots,
    })

    const createdparkingLot = await ParkingLots.findById(parkingLot._id)

    if (!createdparkingLot) {
        throw new ApiError(500, "Failed to create parking lot")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdparkingLot, "Parking lot created successfully"))
})

const getAllParkingLots = asyncHandler(async (req: Request, res: Response) => {
    const parkingLots = await ParkingLots.find().sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, parkingLots, "Parking lots fetched successfully"))
})

const getParkingLotById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const parkingLot = await ParkingLots.findById(id)

    if (!parkingLot) {
        throw new ApiError(404, "Parking lot not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, parkingLot, "Parking lot fetched successfully"))
})

const updateParkingLotDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { lotName, address, totalSlots } = req.body

    const updatePayload: Partial<{
        lotName: string
        address: string
        totalSlots: number
    }> = {}

    if (lotName) updatePayload.lotName = lotName
    if (address) updatePayload.address = address
    if (totalSlots !== undefined) updatePayload.totalSlots = totalSlots

    if (Object.keys(updatePayload).length === 0) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const updatedParkingLot = await ParkingLots.findByIdAndUpdate(
        id,
        { $set: updatePayload },
        { new: true, runValidators: true }
    )

    if (!updatedParkingLot) {
        throw new ApiError(404, "Parking lot not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedParkingLot, "Parking lot details updated successfully"))
})

const updateParkingLotImage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const parkingLotImgLocalPath = req.file?.path

    if (!parkingLotImgLocalPath) {
        throw new ApiError(400, "Parking lot image is required")
    }

    const uploadedImage = await uploadOnCloudinary(parkingLotImgLocalPath)

    if (!uploadedImage?.url) {
        throw new ApiError(500, "Failed to upload parking lot image")
    }

    const updatedParkingLot = await ParkingLots.findByIdAndUpdate(
        id,
        { $set: { parkingLotImg: uploadedImage.url } },
        { new: true, runValidators: true }
    )

    if (!updatedParkingLot) {
        throw new ApiError(404, "Parking lot not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedParkingLot, "Parking lot image updated successfully"))
})

const deleteParkingLot = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const deletedParkingLot = await ParkingLots.findByIdAndDelete(id)

    if (!deletedParkingLot) {
        throw new ApiError(404, "Parking lot not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Parking lot deleted successfully"))
})


export {
    createParkingLot,
    getAllParkingLots,
    getParkingLotById,
    updateParkingLotDetails,
    updateParkingLotImage,
    deleteParkingLot,
}

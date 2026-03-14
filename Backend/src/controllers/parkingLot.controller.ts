import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { uploadOnCloudinary } from "../utils/cloudinary"
import { ParkingLots } from "../models/parkingLot.model"

const createParkingLot = asyncHandler(async (req: Request, res: Response) => {
    const { name, address, totalSlots } = req.body

    if ([name, address, totalSlots].some((field) => field === undefined || field === null || field === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const files = req.files as {
        parkingLotImg?: Express.Multer.File[]
    }

    const parkingLotImgLocalPath = files?.parkingLotImg?.[0]?.path

    if (!parkingLotImgLocalPath) {
        throw new ApiError(400, "Parking lot image is required")
    }

    const uploadedParkingLotImg = await uploadOnCloudinary(parkingLotImgLocalPath)

    if (!uploadedParkingLotImg?.url) {
        throw new ApiError(500, "Failed to upload parking lot image")
    }

    const parkingLot = await ParkingLots.create({
        name,
        address,
        image: uploadedParkingLotImg.url,
        totalSlots,
    })

    return res
        .status(201)
        .json(new ApiResponse(201, parkingLot, "Parking lot created successfully"))
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

const updateParkingLot = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, address, totalSlots } = req.body

    const updatePayload: Partial<{
        name: string
        address: string
        totalSlots: number
        image: string
    }> = {}

    if (name) updatePayload.name = name
    if (address) updatePayload.address = address
    if (totalSlots !== undefined) updatePayload.totalSlots = totalSlots

    const files = req.files as {
        image?: Express.Multer.File[]
    }

    const imageLocalPath = files?.image?.[0]?.path

    if (imageLocalPath) {
        const uploadedImage = await uploadOnCloudinary(imageLocalPath)

        if (!uploadedImage?.url) {
            throw new ApiError(500, "Failed to upload parking lot image")
        }

        updatePayload.image = uploadedImage.url
    }

    const updatedParkingLot = await ParkingLots.findByIdAndUpdate(
        id,
        {
            $set: updatePayload,
        },
        {
            new: true,
            runValidators: true,
        }
    )

    if (!updatedParkingLot) {
        throw new ApiError(404, "Parking lot not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedParkingLot, "Parking lot updated successfully"))
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
    updateParkingLot,
    deleteParkingLot,
}

import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { User } from "../models/user.model"
import { uploadOnCloudinary } from "../utils/cloudinary"
import { ApiResponse } from "../utils/ApiResponse"

const registerUser = asyncHandler( async (req: Request, res: Response) => {

    
    const {fullName, email, password, phoneNo} = req.body
    
    console.log("email : ", email)

    if (
        [fullName, email, password, phoneNo].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email})

    if (existedUser) {
        throw new ApiError(409, "User with email is already existed")
    }

    
    const files = req.files as {
            profileImg?: Express.Multer.File[]
        }


        const profileImgLocalPath = files?.profileImg?.[0].path
        
        if (!profileImgLocalPath) {
            throw new ApiError(400, "Profile Image is required")
        }
        

    const profileImg = await uploadOnCloudinary(profileImgLocalPath)
    
    

    const user = await User.create({
        fullName,
        profileImg: profileImg?.url || "",
        email,
        password,
        phoneNo,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while regestering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User regesterd Successfully")
    )
    
})


export {
    registerUser
}
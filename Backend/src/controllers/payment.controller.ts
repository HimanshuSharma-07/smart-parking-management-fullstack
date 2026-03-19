import { Booking } from "../models/bookig.model";
import { Payment } from "../models/payment.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";


const createPayment = asyncHandler ( async (req: Request, res: Response) => {

    const { bookingId } = req.params
    const { paymentMethod } = req.body

    const booking = await Booking.findById(bookingId)

    if (!booking) {
        throw new ApiError(404, "Booking not found")
    }

    const existedUser = await Payment.findOne({ bookingId })

    if(existedUser){
        throw new ApiError(400, "Payment already existed for this booking")
    }

    

})
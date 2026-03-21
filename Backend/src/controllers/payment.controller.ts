import { Booking } from "../models/bookig.model";
import { Payment } from "../models/payment.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
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

    const payment = await Payment.create({
        bookingId,
        
        paymentMethod,
        paymentStatus: paymentMethod === "cash" ? "paid" : "pending",
        paidAt: paymentMethod === "cash" ? new Date() : undefined

    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, payment, "Payment created Successfully")
    )

})

const verifyPayment = asyncHandler( async (req: Request, res: Response) =>{

    const { paymentId } = req.params

    const payment = await Payment.findById(paymentId)

    if (!payment) {
        throw new ApiError(404, "Payment not found")
    }

    if (payment.paymentStatus == "paid") {
        throw new ApiError(400, "Already paid")
    }

    payment.paymentStatus = "paid"
    payment.paidAt = new Date()

    await payment.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment,"Payment verified Successfully")
    )

})

export {
    createPayment,
    verifyPayment

}
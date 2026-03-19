import { Schema, model, Document, Types } from "mongoose"

export interface IVehicleSession extends Document {
    userId?: Types.ObjectId
    bookingId?: Types.ObjectId
    slotId: Types.ObjectId
    vehicleNumber: string
    entryTime: Date
    exitTime?: Date
    totalPrice?: number
    status: "parked" | "completed"
}

const vehicleSessionSchema = new Schema<IVehicleSession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking"
        },

        slotId: {
            type: Schema.Types.ObjectId,
            ref: "ParkingSlots",
            required: true
        },

        vehicleNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        entryTime: {
            type: Date,
            default: Date.now
        },

        exitTime: {
            type: Date
        },

        totalPrice: {
            type: Number
        },

        status: {
            type: String,
            enum: ["parked", "completed"],
            default: "parked"
        }
    },
    { timestamps: true }
)

export const VehicleSession = model<IVehicleSession>("VehicleSession",vehicleSessionSchema)
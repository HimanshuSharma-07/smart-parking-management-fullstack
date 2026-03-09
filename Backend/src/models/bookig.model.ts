import {Schema, model, Document, Types} from "mongoose"

export interface IBooking extends Document{
    userId: Types.ObjectId;
    slotId: Types.ObjectId;
    vehicleNumber: string;
    startTime: Date;
    endTime: Date;
    bookingStatus: "active" | "upcoming" | "compeleted" | "cancelled"

}

const bookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        slotId: {
            type: Schema.Types.ObjectId,
            ref: "ParkingSlots"
        },
        vehicleNumber: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        bookingStatus: {
            type: String,
            required: true,
            enum: ["active", "upcoming", "compeleted", "cancelled"],
            default: "upcoming"
        }

            
    }, {timestamps: true}
)

export const Booking = model<IBooking>("Booking", bookingSchema)
import {Schema, model, Document, Types} from "mongoose"

export interface IPayment extends Document{
    bookingId: Types.ObjectId
    amount: number;
    paymentMethod: "card" | "upi" | "cash";
    paymentStatus: "pending" | "paid" | "failed";
    paidAt?: Date;
}

const paymentSchema = new Schema<IPayment>( 
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            index: true,
        },
        amount: {
            types: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["card", "upi", "cash"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },
        paidAt: {
            type: Date
        }

    }, {timestamps: true}
);

export const Payment = model<IPayment>("Payment", paymentSchema)
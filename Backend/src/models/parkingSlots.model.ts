import {Schema, model, Document, Types} from "mongoose"

export interface IParkingSlots extends Document {
    slotNumber: string;
    lotId: Types.ObjectId;
    floor: Number;
    type: "standard" | "ev" | "large" | "disabled";
    status: "available" | "occupied" | "reserved" | "maintenance";
    pricePerHour: number;

}

const parkingSlotsSchema = new Schema<IParkingSlots>(
    {
        slotNumber: {
            type: String,
            required: true,
        },
        lotId: {
            type: Schema.Types.ObjectId,
            ref: "ParkingLot",
            required: true,
            index: true
        },
        floor: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ["standard", "ev", "large", "disabled"],
        },
        status: {
            type: String,
            enum: ["available", "occupied", "reserved", "maintenance"],
            default: "available"
        },
        pricePerHour: {
            type: Number,
            required: true
        }
    }, {timestamps: true}
        
)

export const ParkingSlots = model<IParkingSlots>("ParkingSlots", parkingSlotsSchema)
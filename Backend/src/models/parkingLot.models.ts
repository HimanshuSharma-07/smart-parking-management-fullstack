import {Schema, model, Document, Types} from "mongoose"

export interface IParkingLot extends Document {
        name: string,
        address: string,
        image: string,
        totalSlots: number,
    }

const parkingLotsSchema = new Schema<IParkingLot>(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required:true,
        },
        image: {
            type: String,
            required:true,
        },
        totalSlots: {
            type: Number,
            required:true,
        }
    }, {timestamps: true}

)

export const ParkingLots = model<IParkingLot>("ParkingLots", parkingLotsSchema)
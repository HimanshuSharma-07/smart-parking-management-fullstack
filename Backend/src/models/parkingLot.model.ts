import {Schema, model, Document, Types} from "mongoose"

export interface IParkingLot extends Document {
        lotName: string,
        address: string,
        parkingLotImg: string,
        totalSlots: number,
        totalFloors: number,
        slotsPerFloor: number,
        availableSlots: number,
    }

const parkingLotsSchema = new Schema<IParkingLot>(
    {
        lotName: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required:true,
        },
        parkingLotImg: {
            type: String,
            required:true,
        },
        totalSlots: {
            type: Number,
            required:true,
        },
        totalFloors: {
            type: Number,
            required: true,
        },
        slotsPerFloor: {
            type: Number,
            required: true,
        },
        availableSlots: {
            type: Number,
            required: true,
            default: 0
        }
    }, {timestamps: true}

)

export const ParkingLots = model<IParkingLot>("ParkingLots", parkingLotsSchema)
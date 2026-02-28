import {Schema, model, Document} from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role: "user" | "admin";
}
const userSchema = new Schema<IUser>( 
    {
        fullName: {
            type: String,
            required: true,
            trim: true   
        },
        email: {
            type: String,
            required:true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true   
        },
        phone: {
            type: String
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

    }, {timestamps: true}
)


export const User = model<IUser>("User", userSchema)


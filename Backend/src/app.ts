import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from "./routes/user.routes"
import parkingLotRouter from "./routes/parkingLot.routes"
import parkingSlotRouter from "./routes/parkingSlots.routes"
import bookingRouter from "./routes/booking.routes"
import vehicleRouter from "./routes/vehicle.route"
import paymentRouter from "./routes/payment.routes"


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/parking-lots", parkingLotRouter)
app.use("/api/v1/parking-slots", parkingSlotRouter)
app.use("/api/v1/bookings", bookingRouter)
app.use("/api/v1/vehicle", vehicleRouter)
app.use("api/v1/payment", paymentRouter)



export default app
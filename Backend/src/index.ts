import dotenv from "dotenv"
dotenv.config({
    path: '.env'
})
import connectDB from "./db/index"
import app from "./app"



connectDB()
.then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`⚙️   Server is listening at ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!!", err)
})


import { Server } from "socket.io"
import { Server as HttpServer } from "http"
import { ApiError } from "../utils/ApiError"


let io: Server

const initSocket = (server: HttpServer) => {

    io = new Server(server)


    io.on("connection", (socket) => {
        console.log("🔌 User connected: ", socket.id)

        socket.on("joinLot", (lotId: string) => {
            socket.join(lotId)
            console.log(`User joined lot: ${lotId}`)
        })

        socket.on("disconnect", () => {
            console.log("❌ User disconnected: ", socket.id)
        })
    })

}

const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket not initialized")
    }
    return io
}

export{
    initSocket,
    getIO
}
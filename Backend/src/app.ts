import express from "express"

const app = express()

app.get("/", (req, res) => {
    res.send("Hello Form TypeScript Backend")
})

export default app
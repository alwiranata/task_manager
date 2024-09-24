import express from "express"
import cors from "cors"
import authRoutes from "../routes/authRoutes.js"
import taskRoutes from "../routes/taskRoutes.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

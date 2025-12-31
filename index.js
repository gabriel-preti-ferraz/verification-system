import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import verifyToken from "./middlewares/verifyToken.js"
import db from "./database/db.js"

const app = express()

app.use(express.json())
app.use(cors)
app.listen(process.env.API_PORT, () => console.log(`Server is running on PORT ${procces.env.API_PORT}`))

app.get("/license/check/:projectId", verifyToken, async (req, res) => {
    const projectId = req.params.projectId
})
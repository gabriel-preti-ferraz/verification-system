import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import verifyToken from "./middlewares/verifyToken.js"
import checkLicense from "./licenseController.js"
import db from "./database/db.js"

const app = express()

app.use(express.json())
app.use(cors)
app.listen(process.env.API_PORT, () => console.log(`Server is running on PORT ${process.env.API_PORT}`))

app.get("/license/check/:projectId", async (req, res) => {
    const projectId = req.params.projectId

    try {
        const license = await checkLicense(projectId)

        if (license.status === 404) return res.status(404).json(license)
        
        res.json(license)
    } catch (err) {
        console.error(err)
        res.status(500).json({status: "error", message: "Internal server error"})
    }
})
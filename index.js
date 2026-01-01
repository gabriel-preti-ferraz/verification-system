import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import verifyToken from "./middlewares/verifyToken.js"
import checkLicense from "./licenseController.js"
import client from "./database/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const app = express()

app.use(express.json())
app.use(cors())
app.listen(process.env.API_PORT, () => console.log(`Server is running on PORT ${process.env.API_PORT}`))

app.post("/users/create", async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await client.query(
            "INSERT INTO users (username, email, password) VALUES($1, $2, $3)",
            [username, email, hashedPassword]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

app.post("/projects/create", async (req, res) => {
    try {
        const { name, expires_at, user_id } = req.body

        const result = await client.query(
            "INSERT INTO projects (name, expires_at, user_id) VALUES ($1, $2, $3)",
            [name, expires_at, user_id]
        )

        const token = jwt.sign({userId: user_id}, process.env.SECRET_KEY)

        console.log(result, token)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

app.get("/license/check/:projectId", verifyToken, async (req, res) => {
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
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

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params
        const {username, email, role} = req.body
        const result = await client.query("UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, username, email, role", [username, email, role, id])
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params
        await client.query("DELETE FROM users WHERE id = $1", [id])
        res.json({message: "User deleted."})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.post("/projects/create", async (req, res) => {
    try {
        const { name, expires_at, user_id } = req.body

        const result = await client.query(
            "INSERT INTO projects (name, expires_at, user_id) VALUES ($1, $2, $3) RETURNING *",
            [name, expires_at, user_id]
        )

        const project = result.rows[0]
        const token = jwt.sign({
            projectId: project.id,
            userId: user_id
        }, process.env.SECRET_KEY)
        
        res.status(201).json({project, token})
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

app.put("/projects/:id", async (req, res) => {
    try {
        const { id } = req.params
        const {name, expires_at, status, user_id} = req.body
        const result = await client.query("UPDATE projects SET name = $1, expires_at = $2, status = $3, user_id = $4 WHERE id = $5 RETURNING *", [name, expires_at, status, user_id, id])
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.delete("/projects/:id", async (req, res) => {
    try {
        const { id } = req.params
        await client.query("DELETE FROM projects WHERE id = $1", [id])
        res.json({message: "Project deleted."})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.get("/license/check/", verifyToken, async (req, res) => {
    try {
        const license = await checkLicense(req.project.projectId)

        if (license.status === 404) return res.status(404).json(license)
        
        res.json(license)
    } catch (err) {
        console.error(err)
        res.status(500).json({status: "error", message: "Internal server error"})
    }
})
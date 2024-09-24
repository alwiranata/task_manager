import db from "../config/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Register new user
export const registerUser = async (req, res) => {
	const {username, password} = req.body
	const hashedPassword = await bcrypt.hash(password, 10)

	db.query(
		"INSERT INTO users (username, password) VALUES (?, ?)",
		[username, hashedPassword],
		(err) => {
			if (err) return res.status(500).send(err)
			res.sendStatus(201)
		}
	)
}

// Login user
export const loginUser = (req, res) => {
	const {username, password} = req.body

	db.query(
		"SELECT * FROM users WHERE username = ?",
		[username],
		async (err, results) => {
			if (err || results.length === 0)
				return res.status(401).send("User not found")

			const user = results[0]
			const match = await bcrypt.compare(password, user.password)
			if (!match) return res.status(401).send("Invalid credentials")

			const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {
				expiresIn: "1h",
			})
			res.json({token})
		}
	)
}

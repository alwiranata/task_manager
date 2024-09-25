import db from "../config/db.js"

// Get all tasks for the logged-in user
export const getTasks = (req, res) => {
	db.query(
		"SELECT * FROM tasks WHERE user_id = ?",
		[req.user.id],
		(err, results) => {
			if (err) return res.status(500).send(err)
			res.json(results)
		}
	)
}

// Create a new task for the logged-in user
export const createTask = (req, res) => {
	const {title} = req.body

	db.query(
		"INSERT INTO tasks (title, user_id) VALUES (?, ?)",
		[title, req.user.id],
		(err, results) => {
			if (err) return res.status(500).send(err)
			res.status(201).json({id: results.insertId, title, completed: true})
		}
	)
}

// Update task completion status
export const updateTask = (req, res) => {
	const {completed} = req.body
	db.query(
		"UPDATE tasks SET completed = ? WHERE task_id = ? AND user_id = ?",
		[completed, req.params.id, req.user.id],
		(err) => {
			if (err) return res.status(500).send(err)
			res.sendStatus(204)
		}
	)
}

// Delete a task
export const deleteTask = (req, res) => {
	db.query(
		"DELETE FROM tasks WHERE task_id = ? AND user_id = ?",
		[req.params.id, req.user.id],
		(err) => {
			if (err) return res.status(500).send(err)
			res.sendStatus(204)
		}
	)
}

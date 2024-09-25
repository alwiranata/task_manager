import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom" // Import useNavigate for navigation
import swal from "sweetalert2"

const Tasks = () => {
	const [tasks, setTasks] = useState([])
	const [taskTitle, setTaskTitle] = useState("")
	const [editingTaskId, setEditingTaskId] = useState(null)
	const [token, setToken] = useState(localStorage.getItem("token"))
	const [loading, setLoading] = useState(false) // Loading state
	const navigate = useNavigate() // Initialize navigate

	const handleLogout = () => {
		swal
			.fire({
				title: "Konfirmasi Logout",
				text: "Apakah Anda yakin ingin keluar?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Ya, keluar!",
			})
			.then((result) => {
				if (result.isConfirmed) {
					localStorage.removeItem("token") // Hapus token dari localStorage
					setToken(null) // Hapus token dari state
					navigate("/login") // Redirect ke halaman login
				}
			})
	}

	// Fetch tasks from the server
	useEffect(() => {
		const fetchTasks = async () => {
			setLoading(true) // Set loading state
			try {
				const response = await fetch("http://localhost:3000/api/tasks", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (!response.ok) {
					const error = await response.json()
					swal("Error!", error.message || "Failed to fetch tasks.", "error")
					return
				}

				const data = await response.json()
				setTasks(data)
			} catch (e) {
				swal(e, "An error occurred while fetching tasks.", "error")
			} finally {
				setLoading(false) // Clear loading state
			}
		}

		if (token) {
			fetchTasks()
		} else {
			navigate("/login") // Redirect to login if no token
		}
	}, [token, navigate])

	// Add or update task
	const handleSubmit = async (e) => {
		e.preventDefault()

		const method = editingTaskId ? "PATCH" : "POST"
		const url = editingTaskId
			? `http://localhost:3000/api/tasks/${editingTaskId}`
			: "http://localhost:3000/api/tasks"

		try {
			const response = await fetch(url, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({title: taskTitle}),
			})

			console.log("Response Status:", response.status) // Log the response status

			// Handle the response based on the status code
			if (response.status === 204) {
				// For 204 No Content, simply update the task in state without fetching data
				if (editingTaskId) {
					setTasks(
						tasks.map((task) =>
							task.id === editingTaskId ? {...task, title: taskTitle} : task
						)
					)
				}
				swal("Success!", "Task updated!", "success")
				setTaskTitle("")
				setEditingTaskId(null)
				return // Exit function since there's no body to handle
			}

			const data = await response.json() // This will only be reached for responses that include a body

			if (!response.ok) {
				console.log("Error Response:", data) // Log the error response if not okay
				swal("Error!", data.message || "Failed to save task.", "error")
				return
			}

			// Successfully received new task object
			if (editingTaskId) {
				setTasks(tasks.map((task) => (task.id === editingTaskId ? data : task)))
			} else {
				setTasks([...tasks, data])
			}
			setTaskTitle("")
			setEditingTaskId(null)
			swal(
				"Success!",
				editingTaskId ? "Task updated!" : "Task added!",
				"success"
			)
		} catch (e) {
			console.error("Fetch Error:", e) // Log any fetch errors
			swal("Error!", "An error occurred while saving the task.", "error")
		}
	}

	// Edit task
	const handleEdit = (task) => {
		setTaskTitle(task.title)
		setEditingTaskId(task.id)
	}

	// Delete task
	const handleDelete = async (id) => {
		swal
			.fire({
				title: "Delete List",
				text: "Apakah Anda yakin ingin menghapus?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Ya, hapus!",
			})
			.then(async (result) => {
				if (result.isConfirmed) {
					try {
						const response = await fetch(
							`http://localhost:3000/api/tasks/${id}`,
							{
								method: "DELETE",
								headers: {
									Authorization: `Bearer ${token}`,
								},
							}
						)

						if (!response.ok) {
							const error = await response.json()
							swal.fire(
								"Error!",
								error.message || "Failed to delete task.",
								"error"
							)
							return
						}

						setTasks(tasks.filter((task) => task.id !== id))
						swal.fire({
							icon: "success",
							text: "Data berhasil dihapus",
							confirmButtonColor: "#3085d6",
							confirmButtonText: "Oke",
						})
						// eslint-disable-next-line no-unused-vars
					} catch (e) {
						swal.fire(
							"Error!",
							"An error occurred while deleting the task.",
							"error"
						)
					}
				} else {
					swal.fire("Your task is safe!")
				}
			})
	}

	return (
		<div className='container mt-5'>
			{loading ? (
				<p>Loading tasks...</p>
			) : (
				<form
					onSubmit={handleSubmit}
					className='d-flex align-items-center'
				>
					<div className='flex-grow-1 me-2'>
						<input
							type='text'
							className='form-control'
							id='taskTitle'
							value={taskTitle}
							onChange={(e) => setTaskTitle(e.target.value)}
							required
						/>
					</div>
					<button
						type='submit'
						className='btn btn-primary'
					>
						{editingTaskId ? (
							<i className='bi bi-patch-plus'></i>
						) : (
							<i className='bi bi-patch-plus'></i>
						)}
					</button>
					<button
						className='btn btn-danger'
						onClick={handleLogout}
					>
						<i className='bi bi-person-x'></i>
					</button>
				</form>
			)}

			<div className='row mt-5'>
				{tasks.map((task) => (
					<div
						className='col-md-3'
						key={task.id}
					>
						<div className='card mb-3'>
							<div className='card-body'>
								<h5 className='card-title'>{task.title}</h5>
								<div className='d-flex justify-content-end'>
									<button
										className='btn btn-primary btn-sm me-2'
										onClick={() => handleEdit(task)}
									>
										<i className='bi bi-feather'></i>
									</button>
									<button
										className='btn btn-danger btn-sm'
										onClick={() => handleDelete(task.id)}
									>
										<i className='bi bi-journal-x'></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Tasks

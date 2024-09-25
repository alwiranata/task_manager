import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import swal from "sweetalert"
import "bootstrap-icons/font/bootstrap-icons.css"

const Login = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	})

	const navigate = useNavigate()

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		// Check if form data is not empty
		if (!formData.username || !formData.password) {
			swal("Please fill out all fields", "", "error")
			return
		}

		// Send data to the backend using fetch API
		try {
			const response = await fetch("http://localhost:3000/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})

			// Read the response body once
			const responseBody = await response.json() // Change to json() instead of text()

			console.log("Response Body:", responseBody)

			// If status is successful (200)
			if (response.status === 200) {
				// Save token to localStorage
				localStorage.setItem("token", responseBody.token) // Assuming your backend sends a token
				swal("Login successful!", "", "success").then(() => {
					navigate("/tasks")
				})
			} else {
				swal("Login failed", responseBody.message || "Unknown error", "error")
			}
		} catch (error) {
			console.error("Error:", error)
			swal("An error occurred during login", "", "error")
		}
	}

	return (
		<div className='container mt-5'>
			<div className='row justify-content-center'>
				<div className='col-md-6'>
					<div className='card'>
						<div className='card-body'>
							<h2 className='text-center'>
								<i className='text-primary bi bi-opencollective'></i>
								<i className='text'> LOGIN</i>
							</h2>

							{/* Tetap menyertakan teks 'Login' jika diinginkan */}
							<form onSubmit={handleSubmit}>
								<div className='mb-3'>
									<label
										htmlFor='username'
										className='form-label'
									>
										Username
									</label>
									<input
										type='text'
										className='form-control'
										id='username'
										name='username'
										value={formData.username}
										onChange={handleChange}
										required
									/>
								</div>
								<div className='mb-3'>
									<label
										htmlFor='password'
										className='form-label'
									>
										Password
									</label>
									<input
										type='password'
										className='form-control'
										id='password'
										name='password'
										value={formData.password}
										onChange={handleChange}
										required
									/>
								</div>
								<button
									type='submit'
									className='btn btn-primary w-100'
								>
									Login
								</button>
							</form>
							<div className='text-center mt-3'>
								<p>
									Don&apos;t have an account?{" "}
									<Link to='/register'>Register here</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login

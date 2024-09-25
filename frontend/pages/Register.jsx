// src/pages/Register.jsx
import {useState} from "react"
import swal from "sweetalert"
import {Link} from "react-router-dom"
const Register = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	})

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		// Cek jika data form tidak kosong
		if (!formData.username || !formData.password) {
			alert("Please fill out all fields")
			return
		}

		// Kirim data ke backend menggunakan fetch API
		try {
			const response = await fetch("http://localhost:3000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
			const responseBody = await response.text() // Baca body sebagai teks sekali
			console.log("Response Body:", responseBody)

			// Jika status sukses (200/201), anggap respons berupa teks
			if (response.status === 200 || response.status === 201) {
				swal(responseBody, "Registration successful!", "success")
			} else {
				swal("Already Exists", "Registration Failed", "warning")
			}
		} catch (error) {
			swal(error, "An error occurred during registration", "error")
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
								<i className='text'> REGISTER</i>
							</h2>
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
									Register
								</button>
							</form>
							<div className='text-center mt-3'>
								<p>
									Already Have an account?{""}
									<Link to='/login'>Login here</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Register

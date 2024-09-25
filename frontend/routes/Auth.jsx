// src/App.jsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Register from "../pages/Register"
import Login from "../pages/Login"
import Tasks from "../pages/Tasks"

const Auth = () => {
	return (
		<Router>
			<div>
				<Routes>
					<Route
						path='/register'
						element={<Register />}
					/>
					<Route
						path='/login'
						element={<Login />}
					/>
					<Route
						path='Tasks'
						element={<Tasks/>}
					/>
				</Routes>
			</div>
		</Router>
	)
}

export default Auth

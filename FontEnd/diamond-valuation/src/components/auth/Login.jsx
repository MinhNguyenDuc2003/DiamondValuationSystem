import React, { useState } from "react"
import { loginUser } from "../utils/ApiFunctions"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

export const Login = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const [login, setLogin] = useState({
		email: "",
		password: ""
	})

	const navigate = useNavigate()
	const location = useLocation()
	const auth = useAuth()
	const redirectUrl = location.state?.path || "/"

	const handleInputChange = (e) => {
		setLogin({ ...login, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await loginUser(login);
		
		if (result.token) {
			const token = result.token;
			auth.handleLogin(token)
			navigate(redirectUrl, { replace: true })
		} else {
			setErrorMessage(result.message	 || "Invalid email or password. Please try again.");
		}
		setTimeout(() => {
			setErrorMessage("");
		}, 4000);
	};

	return (
		<section className="container col-6 mt-5 mb-5">
			<form onSubmit={handleSubmit} style={{ maxWidth: "350px", margin: "0 auto" }}>
			{errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
			<div className="border border-secondary rounded p-3">
				<div className="row mb-3">
					<label htmlFor="email" className="col-sm-2 col-form-label">
						Email
					</label>
					<div>
						<input
							id="email"
							name="email"
							type="email"
							className="form-control"
							value={login.email}
							onChange={handleInputChange}
							required
						/>
					</div>
				</div>

				<div className="row mb-3">
					<label htmlFor="password" className="col-sm-2 col-form-label">
						Password
					</label>
					<div>
						<input
							id="password"
							name="password"
							type="password"
							className="form-control"
							value={login.password}
							onChange={handleInputChange}
							required
							minLength={5}
						/>
					</div>
				</div>
				

				<div className="mb-3">
					<button type="submit" className="btn btn-hotel" style={{ marginRight: "10px",  width: "40%"}}>
						Login
					</button>
				</div>
				</div>
			</form>
		</section>
	)
}

export default Login
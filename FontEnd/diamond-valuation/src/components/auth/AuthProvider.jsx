import React, { createContext, useState, useContext, useEffect } from "react"
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
	user: null,
	handleLogin: (token) => {},
	handleLogout: () => {}
})

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	let logoutTimer

	const setLogoutTimer = (duration) => {	
		logoutTimer = setTimeout(handleLogout, duration * 1000);
    };

	useEffect(() => {
        // Load user from local storage when the component mounts
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
				const currentTime = Date.now() / 1000;

                if (decodedUser.exp < currentTime) {
                    handleLogout();
                } else {
                    setUser(decodedUser);
                    setLogoutTimer(decodedUser.exp - currentTime);
                }
            } catch (error) {
                console.error("Failed to decode JWT: ", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

	const handleLogin = (token) => {
		try{
			const decodedUser = jwtDecode(token)
			setSubject(decodedUser)
			localStorage.setItem("userRoles", decodedUser.roles)
			localStorage.setItem("token", token)
			setUser(decodedUser)
		} catch (error) {
			console.error("Failed to decode JWT: ", error)
		}
	}

    const setSubject = (decodedUser) => {
        const items = decodedUser.sub.split(','); 
        localStorage.setItem("userId", items[0]);
        localStorage.setItem("userName", items[1]);
    }

	const handleLogout = () => {
		localStorage.removeItem("userId")
        localStorage.removeItem("userName")
		localStorage.removeItem("userRoles")
		localStorage.removeItem("token")
		setUser(null)
		clearTimeout(logoutTimer);
	}

	return (
		<AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
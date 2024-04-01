import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null)

    const login = async (userCredential) => {
        const res = await axios.post(`${apiBaseURL}/auth/login`, userCredential);
        setUser(res.data)
    }

    const logout = async () => {
        await axios.post(`${apiBaseURL}/auth/logout`);
        setUser(null)
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user))
    }, [user])

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

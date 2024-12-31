import {createContext, useContext, useState} from "react";

export const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children } : any) => {
    const [user, setUser] = useState(null);

    const setAuth = (authUser: any) => {
        setUser(authUser)
    }

    const setUserData = (userData: any) => {
        setUser({...userData})
    }
    return (
        <AuthContext.Provider value={{ user, setAuth, setUserData }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;
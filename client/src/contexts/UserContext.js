import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [pfpUrl, setPfpUrl] = useState('');

    return (
        <UserContext.Provider value={{ pfpUrl, setPfpUrl }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
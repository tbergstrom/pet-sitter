import fetchWithToken from "./fetchUtils"

export const fetchContactInfo = (jwtToken, onLogout) => {
    return fetchWithToken(`http://localhost:8080/api/contact-info/user/my-info`, onLogout, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch contact info")
        }
        return response.json();
    });
};

export const fetchAppUser = (jwtToken, onLogout) => {
    return fetchWithToken(`http://localhost:8080/api/users/my-info`, onLogout, {
        method: "GET",
        headers : {
            "Authorization": `Bearer ${jwtToken}`
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch app user info")
        }
        return response.json();
    });
};
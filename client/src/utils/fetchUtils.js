import jwtDecode from "jwt-decode";


const fetchWithToken = async (url, logout, options = {}) => {
    const token = localStorage.getItem("auth-token");

    if(token) {
      const { expiration } = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (expiration < currentTime) {
        logout();
        throw new Error("Token has expired.");
      }

      options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
      };
    }

    const response = await fetch(url, options);
    if (response.status === 401) {
      logout();
      throw new Error("Unauthorized.")
    }
    return response;
}

export default fetchWithToken;
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { GoogleLogin } from '@react-oauth/google';


export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const auth = useContext(AuthContext)

  
    const handleSubmit = async (event) => {
        event.preventDefault();
  
        // NEW
        const response = await fetch("http://localhost:8080/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password
            }),
        });
    
        // This code executes if the request is successful
        if (response.status === 200) {
            const { jwt_token } = await response.json();
            auth.login(jwt_token);
            navigate("/");
        } else if (response.status === 403) {
            setErrors(["Login failed."]);
        } else {
            setErrors(["Unknown error."]);
        }
    };

    // Need to setErrors, display to DOM when possible
  const handleGoogleSuccess = async (event)=> {
    const tokenId = event.credential;

    try {
      console.log(tokenId);
      const response = await fetch("http://localhost:8080/authenticate-google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({tokenId})
      });

      const data = await response.json();

      if(response.ok) {
        const { jwt_token } = data;
        auth.login(jwt_token);
        navigate("/");
      } else {
        console.log("Response status: " + response.status);
        console.error("Error from backend: ", data);
        navigate("/login");
      }
    }catch (error) {
      console.error("Network error: ", error); // Display errors to DOM
      navigate("/login")
    }
  }

  const handleGoogleFailure = (error)=> {
    console.error("Google Login Error:", error); // Display errors to DOM instead?
  }

  return (
    <div>
      <h2>Login</h2>
      {errors.map((error, i) => (
        <div key={i}>{error}</div>
      ))}

      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        // buttonText="Sign Up with Google"
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
      />

      <form onSubmit={handleSubmit}>
        <div>
          {/* Includes for/id attributes for basic HTML accessibility ♿. */}
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
            id="username"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            id="password"
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
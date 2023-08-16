import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

// Direct child of App.js

// Login for Owners and Sitters - Could have two separate login forms, depending on role
// If so, OwnerLoginForm and SitterLoginForm could be children components
// This is where Google sign-in should live, probably as another child


export default function OwnerLogin() {

// Direct child of App.js

// Login for Owners and Sitters - Could have two separate login forms, depending on role
// If so, OwnerLoginForm and SitterLoginForm could be children components
// This is where Google sign-in should live, probably as another child

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
            password,
            authorization: "SITTER"
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

  return (
    <div>
      <h2>Login as a Sitter</h2>
      {errors.map((error, i) => (
        <div key={i}>{error}</div>
      ))}
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
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

export default function CreateAccount() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("")
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const auth = useContext(AuthContext)

  const handleSubmit = async (event) => {
      event.preventDefault();

      if (!role) {
        setErrors(existingErrors => [...existingErrors, "Please choose a role before proceeding."]);
        return;
      }

      const response = await fetch("http://localhost:8080/create_account", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              username,
              password,
              role
          }),
      });
  
      // This code executes if the request is successful
      if (response.status === 201) {
          navigate("/");
      } else if (response.status === 403) {
          setErrors(["Account Creation failed."]);
      } else {
          const errorMessages = await response.json();
          console.log(errorMessages);
          setErrors([errorMessages.message]);
        }
  };
    // Need to setErrors, display to DOM when possible
    const handleGoogleSuccess = async (event) => {
      const tokenId = event.credential;

      if (!role) {
        setErrors(existingErrors => [...existingErrors, "Please choose a role before proceeding."]);
        return;
      }

      try {

        const response = await fetch("http://localhost:8080/create_account_google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tokenId: tokenId, role })
        });
        
        const data = await response.json();
        
        if (response.status === 201) {
          navigate("/");
        } else {
          // console.log("Response status: " + response.status);
          // console.error("Error from backend: ", data);
          setErrors(existingErrors => [...existingErrors, `Error from backend: ${data}`])
          navigate("/create_account");
        }
      } catch (error) {
        // console.error("Network error:", error);
        setErrors(existingErrors => [...existingErrors, `Network error: ${error}`])
        navigate("/create_account");
      }
  }
  
  const handleGoogleFailure = (error) => {
    setErrors(`[Google Login Error: ${error}]`)
    // console.error("Google Login Error:", error); // Display errors to DOM
  }

  return (
    <div>
      <h2>Sign Up and Find a Sitter Near You</h2>
      {errors.map((error, i) => (
        <div key={i}>{error}</div>
      ))}

      <div>
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          onChange={(event) => setRole(event.target.value)}
          value={role}
          >
          <option value="" disabled>Choose a Role</option>
          <option value="OWNER">Pet Owner</option>
          <option value="SITTER">Pet Sitter</option>
        </select>
      </div>

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
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}
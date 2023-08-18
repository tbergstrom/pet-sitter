import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

export default function CreateAccount() {

// Direct child of App.js

// Where the account creation form lives.
// If we use Google, we could be looking at 4 forms/ children:
// CreateOwnerForm, CreateSitterForm, GoogleCreateSitterForm, GoogleCreateOwnerForm
// Feels like too many

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OWNER")
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const auth = useContext(AuthContext)

  const handleSubmit = async (event) => {
      event.preventDefault();

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

  return (
    <div>
      <h2>Sign Up and Find a Sitter Near You</h2>
      {errors.map((error, i) => (
        <div key={i}>{error}</div>
      ))}

      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />;
      
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
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            onChange={(event) => setRole(event.target.value)}
            value={role}
          >
            <option value="OWNER">Pet Owner</option>
            <option value="SITTER">Pet Sitter</option>
          </select>
        </div>
        <div>
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}
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

  // const handleGoogleSuccess = async (credentialResponse) => {
  //   console.log(credentialResponse);
  //   navigate("/callback");

    // const authCode = credentialResponse.credential;
    // const decodedAuthCode = decodeURIComponent(authCode);

    // try {

    //   const response = await fetch('http://localhost:8080/create_account_g', {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': "application/json",
    //   },
    //   body: JSON.stringify({ credential: decodedAuthCode, role }),
    // });

    // if (response.status === 201) {
    //   // navigate("/");
    //   console.log("nice.")
    // } else if (response.status === 403) {
    //   setErrors(["Google Account Creation Failed"]);
    // } else {
    //   const errorMessages = await response.json();
    //   console.log(errorMessages);
    //   setErrors([errorMessages.message]);
    // }
    // } catch (error) {
    //   console.error("Network error", error);
    //   setErrors(["Something went wrong on our end. Please try again."])
    // }

    const handleGoogleSuccess = async (response) => {
      const tokenId = response.credential;

      try {

        console.log(response);
        console.log(tokenId)
        const result = await fetch("http://localhost:8080/create_account_google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tokenId: tokenId, role: "OWNER" })
        });
        
        const data = await result.json();
        
        if (result.status === 201) {
          navigate("/");
        } else {
          console.log("Result status: " + result.status);
          console.error("Error from backend:", data);
          navigate("/create_account")
        }
      } catch (error) {
        console.error("Network error:", error);
        navigate("/create_account");
      }
  }
  
  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
  }



  return (
    <div>
      <h2>Sign Up and Find a Sitter Near You</h2>
      {errors.map((error, i) => (
        <div key={i}>{error}</div>
      ))}

      <GoogleLogin
        clientId={"321605181263-7tsniamk1f3712hs4p6uc26dvshbv46k.apps.googleusercontent.com"}
        buttonText="Login with Google"
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
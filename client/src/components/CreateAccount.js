import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import fetchWithToken from "../utils/fetchUtils";
import AuthContext from "../contexts/AuthContext";
import { Container, Form, Button } from "react-bootstrap";

export default function CreateAccount() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("")
  const [errors, setErrors] = useState([]);
  
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
      event.preventDefault();

      if (!role) {
        setErrors(existingErrors => [...existingErrors, "Please choose a role before proceeding."]);
        return;
      }

      const response = await fetchWithToken("http://localhost:8080/create-account", auth.logout, {
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
          alert("Account successfully created!");
          navigate("/");
      } else if (response.status === 403) {
          setErrors(["Account Creation failed."]);
      } else {
          const errorMessages = await response.json();
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

        const response = await fetchWithToken("http://localhost:8080/create-account-google", auth.logout, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tokenId: tokenId, role })
        });
        
        const data = await response.json();
        
        if (response.status === 201) {
          alert("Account successfully created!");
          navigate("/");
        } else {
          setErrors(existingErrors => [...existingErrors, `Error from backend: ${data}`])
          navigate("/create_account");
        }
      } catch (error) {
        setErrors(existingErrors => [...existingErrors, `Network error: ${error}`])
        navigate("/create_account");
      }
  }
  
  const handleGoogleFailure = (error) => {
    setErrors(`[Google Login Error: ${error}]`)
  }

  return (
    <Container className="px-4 my-5">
      <h2 className="mb-3">Sign Up and Find a Sitter Near You</h2>
      {errors.map((error, i) => (
        <div key={i}>{error}</div>
      ))}

      <div>
        <label className="mb-3" htmlFor="role">Role:</label>
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
      
      <Form className="my-3" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          {/* Includes for/id attributes for basic HTML accessibility ♿. */}
          <Form.Label htmlFor="username">Username:</Form.Label>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
            id="username"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password:</Form.Label>
          <input
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            id="password"
          />
        </Form.Group>
        
        <div>
          <Button variant="info" type="submit">Create Account</Button>
        </div>
      </Form>
    </Container>
  );
}
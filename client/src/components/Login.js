import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

import { Container, Form, Button } from "react-bootstrap";

import fetchWithToken from "../utils/fetchUtils";



export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const auth = useContext(AuthContext)

  
    const handleSubmit = async (event) => {
        event.preventDefault();
  
        const response = await fetchWithToken("http://localhost:8080/authenticate", auth.logout, {
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
      const response = await fetchWithToken("http://localhost:8080/authenticate-google", auth.logout, {
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
    <Container className="px-4 my-5">
      <h2 className="mb-3">Login</h2>
      {errors.map((error, i) => (
        <div key={i}>{error}</div>
      ))}
      
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}

        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
      />

      <Form className="my-5" onSubmit={handleSubmit}>
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
          <Button variant="info" type="submit">Login</Button>
        </div>
      </Form>
    </Container>
  );
}
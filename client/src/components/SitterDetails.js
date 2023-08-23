import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";
import VisitForm from "../components/VisitForm";
import { Container, Form, Button } from "react-bootstrap";

const SitterDetails = (props)=> {

const [sitter, setSitter] = useState(null)
const [errors, setErrors] = useState([]);
const location = useLocation();
const { username } = useParams();

const [owner, setOwner] = useState(null);

const auth = useContext(AuthContext)

useEffect(() => {
    if (username) {
        const loadSitterDetails = () => {

            console.log("Fetching sitter details for ", username);
            fetchWithToken(`http://localhost:8080/api/users/sitter/${username}`, auth.logout, {

                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.user.token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    setErrors(["Could not find nearby sitters"]);
                } else if (response.headers.get('Content-Length') === '0') {
                    return {};
                } else {
                    return response.json().then(payload => setSitter(payload));
                }

            })
            .catch(error => {
                console.log(error);
                setErrors([error]);
            });
        };

        loadSitterDetails();

        if (auth.user.roles[0] === "OWNER") {
            fetchWithToken(`http://localhost:8080/api/users/owner/${auth.user.username}`, auth.logout, {

            method: "GET",
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
            }
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    setErrors(["Could not find nearby sitters"]);
                } else if (response.headers.get('Content-Length') === '0') {
                    return {};
                } else {
                    return response.json().then(payload => setOwner(payload));
                }

            })
            .catch(error => {
                console.log(error);
                setErrors([error]);
            });
        }   
    }
}, [username, auth.user, auth.logout]);



return (
    <Container>
        {errors.length > 0 && 
        <ul>
            {errors.map((error, i) => <li key={i}>{error.message}</li>)}
        </ul>}
        {sitter ? 
            (<div className="sitter-details">
                <h2 className="my-5">Sitter Details</h2>
                <p>Username: {sitter.username}</p>
                {/* <p>Name: {sitter.contactInfo.firstName} {sitter.contactInfo.lastName}</p> */}
                <p>Email: {sitter.contactInfo.email}</p>
                <p>Phone: {sitter.contactInfo.phoneNumber}</p>
                <p>Address: {sitter.contactInfo.streetAddress}, {sitter.contactInfo.city}, {sitter.contactInfo.state} {sitter.contactInfo.zipCode}</p>
                {auth.user.roles[0] === "OWNER" ? <h4 className="my-5">Book a Visit Today!</h4> : <></>}
                {auth.user.roles[0] === "OWNER" ? <VisitForm sitter={sitter} owner={owner} /> : <></>}
            </div>)
            :
            (<p>...Loading</p>)
        }
    </Container>
);
}

export default SitterDetails;
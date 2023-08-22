import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";

const SitterDetails = (props)=> {

const [sitter, setSitter] = useState(null)
const [errors, setErrors] = useState([]);
const location = useLocation();
const { username } = useParams();

const auth = useContext(AuthContext)

useEffect(() => {
    if (username) {
        const loadSitterDetails = () => {

//             fetchWithToken(`http://localhost:8080/api/users/sitter/${props.location.state.sitterFromTable.appUserId}`, auth.logout, {

            console.log("Fetching sitter details for ", username);
            fetch(`http://localhost:8080/api/users/sitter/${username}`, {

                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.user.token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    setErrors(["Something happened"]);
                } else {
                    response.json().then(payload => setSitter(payload))
                }

                if (response.headers.get('Content-Length') === '0') {
                    return {};
                }
                return response.json();

            })
            .catch(error => {
                setErrors([error]);
            });
        };

        loadSitterDetails();
    }

// }, [location.state, auth.user, auth.logout, props.location.state]);

}, [username, auth.user]);



return (
    <>
        {errors.length > 0 && 
        <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
        </ul>}
        {sitter ? 
            (<div className="sitter-details">
                <h2>Sitter Details</h2>
                <p>Username: {sitter.username}</p>
                {/* <p>Name: {sitter.contactInfo.firstName} {sitter.contactInfo.lastName}</p> */}
                <p>Email: {sitter.contactInfo.email}</p>
                <p>Phone: {sitter.contactInfo.phoneNumber}</p>
                <p>Address: {sitter.contactInfo.streetAddress}, {sitter.contactInfo.city}, {sitter.contactInfo.state} {sitter.contactInfo.zipCode}</p>
            </div>)
            :
            (<p>...Loading</p>)
        }
    </>
);
}

export default SitterDetails;
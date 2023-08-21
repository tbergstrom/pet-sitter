import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const SitterDetails = (props)=> {

// Direct Child of SitterTable
// Parent of VisitForm

// Shows location/ contact info for a particular sitter
// Contains VisitForm to request a Care Visit
// Should be accessed via link/ button in SitterTable/ VisitTable
const [sitter, setSitter] = useState(null)
const [errors, setErrors] = useState([]);
const location = useLocation();

const auth = useContext(AuthContext)

console.log("location: ", location);

useEffect(() => {
    if (props.location.state && props.location.state.sitterFromTable) {
        const loadSitterDetails = () => {
            fetch(`http://localhost:8080/api/users/sitter/${props.location.state.sitterFromTable.appUserId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.user.token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    setErrors(["Something happened"]);
                }
                return response.json();
            })
            .then(payload => setSitter(payload))
            .catch(error => {
                console.error("Fetch error: ", error);
                setErrors([error]);
            });
        };

        loadSitterDetails();
    }
}, [location.state, auth.user]);

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
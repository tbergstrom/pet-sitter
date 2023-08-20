import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const ContactInfoDetails = (props)=> {

    const [contactInfo, setContactInfo] = useState(null)
    const [user, setUser] = useState(null)
    const [errors, setErrors] = useState([]);

    const auth = useContext(AuthContext)
    const navigate = useNavigate();
    const params = useParams();
    


    const jwtToken = auth.user.token;

    // const loadContactInfo = ()=> {
    //     // fetch(`http://localhost:8080/api/contact-info/${params.id}`, {
    //     fetch(`http://localhost:8080/api/contact-info/user/my-info`, {
    //         method: "GET",
    //         headers: {
    //             "Authorization": `Bearer ${jwtToken}`
    //         }
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             console.log(response);
    //             setErrors(["Err: ", response.status])
    //         }
    //         return response.json();
    //     })
    //     .then(payload => setContactInfo(payload))
    //     .catch(error => {
    //         console.error("Fetch error: ", error);
    //         setErrors([error.message]);
    //     })   
    // }

    // useEffect(loadContactInfo, [])

    const loadUser = () => {
        fetch(`http://localhost:8080/api/contact-info/user/my-info`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            console.log("Params: ", params);
            if (!response.ok) {
                setErrors(["somethin happn"])
            }
            return response.json();
        })
        .then(payload => setUser(payload))
        .catch(error => {
            console.error("Fetch error: ", error);
            setErrors([error.message]);
        })   
    }

    useEffect(loadUser, [])
    
    console.log("User: ", user);
    console.log(" PROPS: " + props.contactInfo.firstName);

    return (
        <>
            { errors && errors.length > 0 &&
            <ul>
                {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>}
            { user ? 
                (<div className="contact-info-details">
                    <h2>Contact Info Details</h2>
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone Number: {user.phoneNumber}</p>
                    <p>Street Address: {user.streetAddress}</p>
                    <p>City: {user.city}</p>
                    <p>State: {user.state}</p>
                    <p>Zipcode: {user.zipCode}</p>
                </div>)
                :
                (<p>...Loading</p>)
            }
        </>
        
    );
}

export default ContactInfoDetails;
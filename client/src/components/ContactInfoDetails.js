import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";
import { Container, Button } from "react-bootstrap";

const ContactInfoDetails = (props)=> {

    const [contactInfo, setContactInfo] = useState(null)
    const [errors, setErrors] = useState([]);
    const [appUser, setAppUser] = useState(null);
    const [newPfpUrl, setNewPfpUrl] = useState("");
    const [editMode, setEditMode] = useState(false);

    const auth = useContext(AuthContext)

    const jwtToken = auth.user.token;

    const loadUser = () => {
        fetchWithToken(`http://localhost:8080/api/contact-info/user/my-info`, auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                setErrors(["somethin happn"])
            }
            if (response.headers.get('Content-Length') === '0') {
                return {};
            }
            return response.json();
        })
        .then(payload => setContactInfo(payload))
        .catch(error => {
            setErrors([error.message]);
        });
        fetchWithToken(`http://localhost:8080/api/users/my-info`, auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            },
        })   
        .then(response => {
            if (!response.ok) {
                setErrors(["somethin happn"])
            }
            if (response.headers.get('Content-Length') === '0') {
                return {};
            }
            return response.json();
        })
        .then(payload => setAppUser(payload))
        .catch(error => {
            setErrors([error.message]);
        })
    }

    useEffect(loadUser, [])

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleSavePfpUrl = ()=> {

        const trimmedUrl = newPfpUrl.replace(/^"|"$/g, '');

        fetchWithToken("http://localhost:8080/api/users/update-pfp", auth.logout, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(trimmedUrl),
        }) 
        .then((response) => {
            if(response.ok) {
                setAppUser({...appUser, pfpUrl: trimmedUrl});
                setEditMode(false);
            } else {
                console.log("newPfpUrl: ", trimmedUrl);
                setErrors(["Failed to update profile picture"])
            }
        })
        .catch((error) => {
            setErrors([error.message])
        });
    };



    return (
        <Container>
            { errors && errors.length > 0 &&
            <ul>
                {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>}
            { contactInfo ? 
                (<div className="contact-info-details">
                    
                    {appUser && appUser.pfpUrl ? (
                        <div className="profile-picture">
                            <img src={appUser.pfpUrl.replace(/^"|"$/g, '')} alt="" className="img-fluid rounded-circle" style={{ width: '400px', height: '400px' }} />
                        </div>
                        
                    ) : (
                        <p>No Profile Picture Available</p>
                    
                    )}
                    <div className="edit-profile-link">
                        {editMode ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter new PFP URL"
                                    value={newPfpUrl}
                                    onChange={(evt) => setNewPfpUrl(evt.target.value)}
                            />
                            <Button variant="success" onClick={handleSavePfpUrl}>
                                Save
                            </Button>
                            </div>
                        ) : (
                            <button onClick={toggleEditMode}>Edit Pic</button>
                        )}
                    </div>
                    
                    <h2>User Details</h2>
                    <p>First Name: {contactInfo.firstName}</p>
                    <p>Last Name: {contactInfo.lastName}</p>
                    <p>Email: {contactInfo.email}</p>
                    <p>Phone Number: {contactInfo.phoneNumber}</p>
                    <p>Street Address: {contactInfo.streetAddress}</p>
                    <p>City: {contactInfo.city}</p>
                    <p>State: {contactInfo.state}</p>
                    <p>Zipcode: {contactInfo.zipCode}</p>
                </div>)
                :
                (<p>...Loading</p>)
            }
        </Container>
        
    )
}

export default ContactInfoDetails;
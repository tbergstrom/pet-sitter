import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import ConfirmPetDelete from "./ConfirmPetDelete";
import { Container, Button } from "react-bootstrap";

const PetDetails = ()=> {

    const [pet, setPet] = useState(null)
    const [errors, setErrors] = useState([]);

    const auth = useContext(AuthContext)
    const navigate = useNavigate();
    const params = useParams();


    const jwtToken = auth.user.token;

    const loadPetDetails = ()=> {
        fetch(`http://localhost:8080/api/pets/pet/${params.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                setErrors(["somethin happn"])
            }
            return response.json();
        })
        .then(payload => setPet(payload))
        .catch(error => {
            console.error("Fetch error: ", error);
            setErrors([error]);
        })
        
    }

    useEffect(loadPetDetails, [params.id, jwtToken])
    return (
        <Container>
            { errors && 
            <ul>
                {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>}
            { pet ? 
                (<div className="pet-details">
                    <h2>Pet Details</h2>
                    <p>Name: {pet.name}</p>
                    <p>Species: {pet.petType}</p>
                    <p>Description: {pet.notes}</p>
                    <Button variant="info" onClick={() => navigate(`/confirmpetdelete/${pet.petId}`)}>Remove this pet from your list?</Button>
                    {" "}
                    <Button variant="warning" onClick={() => navigate("/manageaccount")}>Back to Manage Account</Button>


                    {/* This button is activating as soon as the PetDetails button is clicked, for some reason. */}
                    {/* <button onClick={navigate('/confirmpetdelete')}>Delete Pet</button> */}
                </div>)
                :
                (<p>...Loading</p>)
            }
        </Container>
        
    );
}

export default PetDetails;
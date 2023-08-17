import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import ConfirmPetDelete from "./ConfirmPetDelete";

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
        <>
            { errors && 
            <ul>
                {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>}
            { pet ? 
                (<div className="pet-details">
                    <h2>Pet Details</h2>
                    <p>Name: {pet.name}</p>
                    <p>Species: {pet.type}</p>
                    <p>Description: {pet.notes}</p>
                    <Link to={`/confirmpetdelete/${pet.petId}`}>Delete Pet</Link>


                    {/* This button is activating as soon as the PetDetails button is clicked, for some reason. */}
                    {/* <button onClick={navigate('/confirmpetdelete')}>Delete Pet</button> */}
                </div>)
                :
                (<p>...Loading</p>)
            }
        </>
        
    );
}

export default PetDetails;
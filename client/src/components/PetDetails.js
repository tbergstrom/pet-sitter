import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import ConfirmPetDelete from "./ConfirmPetDelete";

const PetDetails = ()=> {
    const [pet, setPet] = useState(null)

    const navigate = useNavigate();
  
    const auth = useContext(AuthContext)

    return (
        <div className="pet-details">
            <h2>Pet Details</h2>
            <p>Name: {pet.name}</p>
            <p>Species: {pet.type}</p>
            <p>Description: {pet.notes}</p>
            
            <button onClick={navigate('/confirmpetdelete')}>Delete Pet</button>
        </div>
    );
}

export default PetDetails;
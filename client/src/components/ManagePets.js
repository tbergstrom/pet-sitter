import { useContext, useEffect, useState } from "react";
import PetForm from "./PetForm";
import PetTable from "./PetTable";
import AuthContext from "../contexts/AuthContext";

import { Button, Container, Table } from "react-bootstrap";

import fetchWithToken from "../utils/fetchUtils";

import { useNavigate } from "react-router";



const ManagePets = ()=> {

    const [pets, setPets] = useState([]);
    const [showPetForm, setShowPetForm] = useState(false);

    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = auth.user;
    const jwtToken = auth.user.token;

    const toggleForm = ()=> {
        setShowPetForm(!showPetForm);
    }

    const loadPets = ()=> {
        fetchWithToken("http://localhost:8080/api/pets/mypets", auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(payload => setPets(payload))
    };

    useEffect(loadPets, []);

    return (
        <Container>
            <h3 className="px-4 my-5">{user.username}'s Pets</h3>
            <PetTable pets={pets} loadPets={loadPets}/>
            {showPetForm && <PetForm pets={pets} setPets={setPets} loadPets={loadPets} toggleForm={toggleForm} />}
            
            <Button variant="info" onClick={toggleForm}>
                {showPetForm ? "Cancel" : "Add New Pet"}

            </Button>
            

           
            {" "}
            <Button variant="warning" onClick={() => navigate("/manageaccount")}>Back to Manage Account</Button>

        </Container>
    )
}

export default ManagePets;
import { useContext, useEffect, useState } from "react";
import PetForm from "./PetForm";
import PetTable from "./PetTable";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";
import { Button, Table } from "react-bootstrap";


const ManagePets = ()=> {

    const [pets, setPets] = useState([]);
    const [showPetForm, setShowPetForm] = useState(false);

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
        <>
            <h3>{user.username}'s Pets</h3>
            <PetTable pets={pets} loadPets={loadPets}/>
            {showPetForm && <PetForm pets={pets} setPets={setPets} loadPets={loadPets} toggleForm={toggleForm} />}
            
            <Button variant="info" onClick={toggleForm}>
                {showPetForm ? "Cancel" : "Add New Pet"}

            </Button>
            

           
            {" "}
            <button onClick={() => navigate("/manageaccount")}>Back to Manage Account</button>

        </>
    )
}

export default ManagePets;
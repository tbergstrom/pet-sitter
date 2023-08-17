import { useContext, useEffect, useState } from "react";
import PetForm from "./PetForm";
import PetTable from "./PetTable";
import { useNavigate, useParams } from "react-router";
import AuthContext from "../contexts/AuthContext";

const ManagePets = ()=> {

    const [pets, setPets] = useState([]);
    const [petsCounter, setPetsCounter] = useState(0);
    const [showPetForm, setShowPetForm] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = useContext(AuthContext);
    const user = auth.user;

    const jwtToken = auth.user.token;

    const toggleForm = ()=> {
        setShowPetForm(!showPetForm);
    }

    const loadPets = ()=> {
        fetch("http://localhost:8080/api/pets/mypets", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(payload => {
            setPets(payload);
            console.log(payload);
        })
    };

    useEffect(loadPets, []);

    return (
        <>
            <h3>{user.username}'s Pets</h3>
            <PetTable pets={pets} loadPets={loadPets}/>
            {showPetForm && <PetForm pets={pets} setPets={setPets} loadPets={loadPets}/>}
            
            <button onClick={toggleForm}>
                {showPetForm ? "Cancel" : "Add New Pet"}
            </button>
            
        </>
    )
}

export default ManagePets;
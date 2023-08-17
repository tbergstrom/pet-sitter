import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const ConfirmPetDelete = () => {

// Direct child of PetTable

// Accessed via a button on the PetTable
// Asks if you really want to extinguish your Pet
// Should also be accessed through PetDetails via link/ button

    const params = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [pet, setPet] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/pets/${params.id}`)
        .then(response => {
          if (response.ok) {
            response.json()
            .then(setPet)
          } else {
            navigate("/not-found")
          }
        })
    }, [params.id])

    const handleDelete = () => {
        // Check if the authenticated user is the owner of the pet
        if (auth.user.id === pet.ownerId) {
            fetch(`http://localhost:8080/api/pets/${params.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + auth.user.token
                }
            })
            .then(response => {
                if (response.ok) {
                    navigate("/pettable")
                } else {
                    console.log(`Unexpected response status code ${response.status}`);
                }
            })
        } else {
            console.log("You are not authorized to delete this pet.");
        }
    }

    // if no pet yet, don't attempt to render confirmation information
    if (pet === null) {
        return null;
    }

    return ( 
        <>
            <h2>Confirm Delete</h2>
            <p>Remove this pet from your pet list?</p>
            <ul>
                <li>Name: {pet.name}</li>
            </ul>
            <button onClick={handleDelete}>Delete</button>
            {" "}
            <Link to="/pettable">Cancel</Link>
        </>
    );
}

export default ConfirmPetDelete;
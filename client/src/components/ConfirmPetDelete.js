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
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/pets/pet/${params.id}`, {
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                navigate("/not-found");
                setErrors(["Could not retrieve pet details"])
            }
        })
        .then(setPet)
        .catch(error => console.error(error))
    }, [params.id, auth.user.token, navigate])

    const handleDelete = () => {
        // Check if the authenticated user is the owner of the pet
        // if (auth.user.id === pet.ownerId) {
            fetch(`http://localhost:8080/api/pets/pet/${params.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + auth.user.token
                }
            })
            .then(response => {
                if (response.ok) {
                    navigate("/managepets")
                } else {
                    console.log(`Unexpected response status code ${response.status}`);
                }
            })
        // } else {
        //     console.log("You are not authorized to delete this pet.");
        // }
    }

    // if no pet yet, don't attempt to render confirmation information
    if (pet === null) {
        return null;
    }

    return ( 
        <>
            <h2>Remove this pet from your pet list?</h2>
            <ul>
                <li>Name: {pet.name}</li>
            </ul>
            <button onClick={handleDelete}>Remove?</button>
            {" "}
            <button onClick={() => navigate("/managepets")}>Cancel</button>

        </>
    );
}

export default ConfirmPetDelete;
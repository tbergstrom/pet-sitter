import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";

const ConfirmPetDelete = () => {

    const params = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [pet, setPet] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetchWithToken(`http://localhost:8080/api/pets/pet/${params.id}`, auth.logout, {
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
            }
        })
        .then(response => {
            if (response.ok) {
                if (response.headers.get('Content-Length') === '0') {
                    return {};
                }
                return response.json();
            } else {
                navigate("/not-found");
                setErrors(["Could not retrieve pet details"])
            }
        })
        .then(setPet)
        .catch(error => console.error(error))
    }, [params.id, auth.user.token, navigate, auth.logout])

    const handleDelete = () => {
        // Check if the authenticated user is the owner of the pet
        // if (auth.user.id === pet.ownerId) {
        fetchWithToken(`http://localhost:8080/api/pets/pet/${params.id}`, auth.logout, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + auth.user.token
            }
        })
        .then(response => {
            if (response.ok) {
                navigate("/managepets")
            } else {
                // set error here?
                console.log(`Unexpected response status code ${response.status}`);
            }
        })
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
            <Link to="/managepets">Cancel</Link>
        </>
    );
}

export default ConfirmPetDelete;
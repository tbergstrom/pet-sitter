import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

import { Container, Button } from "react-bootstrap";

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
        <Container>
            <h2 className="px-4 my-5">Remove this pet from your pet list?</h2>
            <ul>
                <li>Name: {pet.name}</li>
            </ul>
            <Button variant="info" onClick={handleDelete}>Remove?</Button>
            {" "}
            <Button variant="warning" onClick={() => navigate("/managepets")}>Cancel</Button>

        </Container>
    );
}

export default ConfirmPetDelete;
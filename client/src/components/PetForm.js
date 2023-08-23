import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

import { Container, Form, Button } from "react-bootstrap";

import fetchWithToken from "../utils/fetchUtils";


const PetForm = (props)=> {

    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [errors, setErrors] = useState([]);

    const [name, setName] = useState("");
    const [petType, setPetType] = useState("");
    const [notes, setNotes] = useState("");
    const [goesWalking, setGoesWalking] = useState(false);

    const resetState = ()=> {
        setName("");
        setPetType("");
        setNotes("");
        setGoesWalking(false);
    }

    const handleSubmit = (evt)=> {
        evt.preventDefault();

        const newPet = {
            name,
            petType,
            notes,
            goesWalking,
        }

        fetchWithToken("http://localhost:8080/api/pets", auth.logout, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + auth.user.token
            },
            body: JSON.stringify(newPet)
        })
        .then(response => {
            if (response.ok) {
                navigate(`/managepets`); 
                resetState();
                props.loadPets();
                props.toggleForm();

            } else {
                response.json()
                .then(errors => {
                    setErrors([errors])
                })
            }
        })
    }

    return (
        <Container>
            <Form className="my-5" onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, i) => <li key={i}> {error}</li>)}
                </ul>
                <Form.Group className="mb-3">
                <fieldset>
                    <label htmlFor="pet-name-input">Name:</label>
                    <input id="pet-name-input" type="text" value={name} onChange={(evt) => setName(evt.target.value)} />
                </fieldset>
                </Form.Group>
                <Form.Group className="mb-3">
                <fieldset className="select">
                    <label htmlFor="pet-type-input">Pet Type: </label>
                    <select id="pet-type-input" value={petType} onChange={(evt) => setPetType(evt.target.value)}>
                        <option>Select an Option</option>
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Fish</option>
                        <option>Reptile</option>
                        <option>Bird</option>
                        <option>Hamster</option>
                    </select>                
                </fieldset>
                </Form.Group>
                <Form.Group className="mb-3">
                <fieldset>
                    <label htmlFor="goes-walking-input">Does your pet require walks? 
                        <input id="goes-walking-input-yes" type="radio" value="true" checked={goesWalking === true} onChange={(evt) => setGoesWalking(true)} />Yes
                        <input id="goes-walking-input-no" type="radio" value="false" checked={goesWalking === false} onChange={(evt) => setGoesWalking(false)} />No
                    </label>
                </fieldset>
                </Form.Group>
                <Form.Group className="mb-3">
                <fieldset>
                    <label htmlFor="notes-input">Additional notes: </label>
                    <textarea id="notes-input" value={notes} onChange={(evt) => setNotes(evt.target.value)}/>
                </fieldset>
                </Form.Group>
                <Button variant="primary" type="submit">Save</Button>
                {/* <Link to="/managepets">Cancel</Link> */}
            </Form>
        </Container>
    )
}

export default PetForm;
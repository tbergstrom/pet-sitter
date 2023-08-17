import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const PetForm = (props)=> {

    const params = useParams(props);
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

    // useEffect(()=> {
    //     if(params.id !== undefined) {
    //         const targetPet = props.pets.find(pet => pet.id === parseInt(params.id))
    //         if(targetPet !== undefined) {
    //             setName(targetPet.name);
    //             setPetType(targetPet.petType);
    //             setNotes(targetPet.notes);
    //             setGoesWalking(targetPet.goesWalking);
    //         }
    //     } else {
    //         resetState();
    //     }
    // }, [props.pets, params.id])

    // useEffect(props.loadPets, [props.pets])


    const handleSubmit = (evt)=> {
        evt.preventDefault();

        const newPet = {
            name,
            petType,
            notes,
            goesWalking,
        }

        // let url = null;
        // let method = null;

        // if (params.id !== undefined) {
        //     newPet.id = params.id;
        //     url = `http://localhost:8080/api/pets/${params.id}`
        //     method = "PUT"
        // } else {
        //     url = "http://localhost:8080/api/pets"
        //     method = "POST"
        // }

        fetch("http://localhost:8080/api/pets", {
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
                navigate(`/managepets`); // need params.id?
                resetState();
                props.loadPets();
                props.toggleForm();
                // a "props.setPetsCounter" could be useful as a useEffect dependency
            } else {
                response.json()
                .then(errors => {
                    setErrors([errors])
                })
            }
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, i) => <li key={i}> {error}</li>)}
                </ul>
                <fieldset>
                    <label htmlFor="pet-name-input">Name:</label>
                    <input id="pet-name-input" type="text" value={name} onChange={(evt) => setName(evt.target.value)} />
                </fieldset>
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
                <fieldset>
                    <label htmlFor="goes-walking-input">Does your pet require walks? 
                        <input id="goes-walking-input-yes" type="radio" value="true" checked={goesWalking === true} onChange={(evt) => setGoesWalking(true)} />Yes
                        <input id="goes-walking-input-no" type="radio" value="false" checked={goesWalking === false} onChange={(evt) => setGoesWalking(false)} />No
                    </label>
                </fieldset>
                <fieldset>
                    <label htmlFor="notes-input">Additional notes: </label>
                    <textarea id="notes-input" value={notes} onChange={(evt) => setNotes(evt.target.value)}/>
                </fieldset>
                <button type="submit">Save</button>
                {/* <Link to="/managepets">Cancel</Link> */}
            </form>
        </>
    )
}

export default PetForm;
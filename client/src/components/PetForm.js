import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const PetForm = (props)=> {
    //props should include list of pets (props.pets) and petCounter (props.petCounter)

// Direct child of ManagePets

// Where a new Pet can be added.
// Should be accessed via button/ link in ManagePets near PetTable
// On submission, should take to PetDetails for that pet

    const params = useParams();
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
            ownerId: params.id,
            name,
            petType,
            notes,
            goesWalking
        }

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
                // a "props.setPetsCounter" could be useful as a useEffect dependency
            } else {
                response.json()
                .then(errors => {
                    setErrors(errors)
                })
            }
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map(error => <li key={error}> {error}</li>)}
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
                    </select>                
                </fieldset>
                <fieldset>
                    <label htmlFor="goes-walking-input">Does your pet require walks? 
                        <input id="goes-walking-input" type="radio" value="yes" checked={goesWalking === "yes"} onChange={(evt) => setGoesWalking(evt.target.value)} />Yes
                        <input id="goes-walking-input" type="radio" value="no" checked={goesWalking === "no"} onChange={(evt) => setGoesWalking(evt.target.value)} />No
                    </label>
                </fieldset>
                <fieldset>
                    <label htmlFor="notes-input">Additional notes: </label>
                    <textarea id="notes-input" value={notes} onChange={(evt) => setNotes(evt.target.value)}/>
                </fieldset>
                <button type="submit">Save</button>
                <Link to="/managepets">Cancel</Link>
            </form>
        </>
    )
}

export default PetForm;
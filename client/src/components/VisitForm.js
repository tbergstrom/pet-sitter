import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const VisitForm = (props)=> {
    // props should include list of visits (props.visits) and visitCounter (props.visitCounter)

// Direct child of SitterDetails but could live elsewhere

// This could be embedded in SitterDetails and/OR
// could be accessible via a link or button in the SitterDetails component
// This component is used to request a Care Visit from a specific Sitter
// It would need to update VisitTable

    const params = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [errors, setErrors] = useState([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("");
    const [notes, setNotes] = useState("");
    const [cost, setCost] = useState(0);

    const resetState = ()=> {
        setStartDate("");
        setEndDate("");
        setStatus("");
        setTimeOfDay("");
        setNotes("");
        setCost(0);
    }

    const handleSubmit = (evt)=> {
        evt.preventDefault();

        const newVisit = {
            startDate,
            endDate,
            status: "Pending",
            timeOfDay,
            notes,
            cost: 100.00, // this will be calculated by the sitter.rate x (endDate - startDate)
            sitterId: "sitterId", // one of these will be from params
            ownerId: "ownerId"  // the other from... auth.user.id?
        }

        fetch("http://localhost:8080/api/visits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + auth.user.token
            },
            body: JSON.stringify(newVisit)
        })
        .then(response => {
            if(response.ok) {
                navigate(`/managevisits`); // need params.id?
                resetState();
                props.loadVisits();
                // a props.setVisitsCounter as useEffect dependency?
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
                    <label htmlFor="start-date-input"> Start: </label>
                    <input 
                    id="start-date-input" 
                    type="date" 
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]} 
                    onChange={(evt) => setStartDate(evt.target.value)}
                    />
                    
                </fieldset>
                <fieldset>
                    <label htmlFor="end-date-input"> End: </label>
                    <input 
                    id="end-date-input" 
                    type="date" 
                    value={endDate}
                    min={new Date().toISOString().split('T')[0]} 
                    onChange={(evt) => setEndDate(evt.target.value)}
                    />
                    
                </fieldset>
                <fieldset>
                    <label htmlFor="time-of-day-input">Time: </label>
                    <input 
                    id="time-of-day-input" 
                    type="time" 
                    value={timeOfDay}
                    onChange={(evt) => setTimeOfDay(evt.target.value)}
                    />

                </fieldset>
                <fieldset>
                    <label htmlFor="notes-input">Additional notes: </label>
                    <textarea id="notes-input" value={notes} onChange={(evt) => setNotes(evt.target.value)}></textarea>
                </fieldset>
                <button type="submit">Save</button>
                <Link to="/managevisits">Cancel</Link>
            </form>
        </>
    )


}

export default VisitForm;
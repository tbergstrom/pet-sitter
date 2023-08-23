import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";
import { Container, Form, Button } from "react-bootstrap";

const VisitForm = (props)=> {

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
            sitterId: props.sitter.appUserId, // one of these will be from params
            ownerId: props.owner.appUserId  // the other from... auth.user.id?
        }

        fetchWithToken("http://localhost:8080/api/visit", auth.logout, {
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
                // props.loadVisits();
                // a props.setVisitsCounter as useEffect dependency?
            } else {
                response.json()
                .then(errors => {
                    setErrors([errors])
                })
            }
        })
    }

    console.log("User is a: ", auth.user.roles[0]);
    console.log("Sitter is: ", props.sitter)
    console.log("Owner is: ", props.owner)
    console.log("Time of day: ", timeOfDay);
    console.log(typeof(timeOfDay));

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <ul>
                    {errors.map(error => <li key={error}> {error.message}</li>)}
                </ul>
                <Form.Group className="mb-3">
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
                </Form.Group>
                <Form.Group className="mb-3">
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
                </Form.Group>
                <Form.Group className="mb-3">
                <fieldset>
                    <label htmlFor="time-of-day-input">Time: </label>
                    <input 
                    id="time-of-day-input" 
                    type="time" 
                    value={timeOfDay}
                    onChange={(evt) => setTimeOfDay(evt.target.value)}
                    />

                </fieldset>
                </Form.Group>
                <Form.Group className="mb-3">
                <fieldset>
                    <label htmlFor="notes-input">Additional notes: </label>
                    <textarea id="notes-input" value={notes} onChange={(evt) => setNotes(evt.target.value)}></textarea>
                </fieldset>
                </Form.Group>
                <Button className="px-4" variant="info" type="submit">Save</Button>
                {" "}
                <Link class="btn btn-warning" to="/managevisits">Cancel</Link>
            </Form>
        </Container>
    )


}

export default VisitForm;
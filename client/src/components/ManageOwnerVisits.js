import { useContext, useState, useEffect } from "react";
import VisitTable from "./VisitTable";
import AuthContext from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import VisitForm from "./VisitForm";

const ManageOwnerVisits = ()=> {

    const [visits, setVisits] = useState([]);
    const [visitsCounter, setVisitsCounter] = useState(visits.length);
    const [showVisitForm, setShowVisitForm] = useState(false);

    
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();
    const user = auth.user;

    const jwtToken = auth.user.token;

    const toggleForm = () => {
        setShowVisitForm(!showVisitForm);
    }

    const loadVisits = () => {
        fetch(`http://localhost:8080/api/visit/owner/${user.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(payload => setVisits(payload))
    };

    useEffect(loadVisits, []);

    return (
        <>
            <h3>{user.username}'s Visits</h3>
            <VisitTable visits={visits} loadVisists={loadVisits} />
            {showVisitForm && <VisitForm visits={visits} setVisits={setVisits} loadVisits={loadVisits} toggleForm={toggleForm} />}
            
            <button onClick={toggleForm}>
                {showVisitForm ? "Cancel" : "Add New Pet"}
            </button>
        </>
    )
}

export default ManageOwnerVisits;
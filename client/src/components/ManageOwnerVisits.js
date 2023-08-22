import { useContext, useState, useEffect } from "react";
import VisitTable from "./VisitTable";
import AuthContext from "../contexts/AuthContext";
import VisitForm from "./VisitForm";
import fetchWithToken from "../utils/fetchUtils";

const ManageOwnerVisits = ()=> {

    const [visits, setVisits] = useState([]);
    const [showVisitForm, setShowVisitForm] = useState(false);

    
    const auth = useContext(AuthContext);
    const user = auth.user;

    const jwtToken = auth.user.token;

    const toggleForm = () => {
        setShowVisitForm(!showVisitForm);
    }

    const loadVisits = () => {
        fetchWithToken(`http://localhost:8080/api/visit/owner/${user.id}`, auth.logout, {
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
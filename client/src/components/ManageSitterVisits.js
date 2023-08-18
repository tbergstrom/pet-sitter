import { useContext, useState, useEffect } from "react";
import VisitTable from "./VisitTable";
import AuthContext from "../contexts/AuthContext";

const ManageSitterVisits = () => {

// Direct child of ManageAccount
// Parent of VisitTable

// Sitters can see their upcoming visits here and pending visits
// Sitters can confirm, deny/ cancel visits
// Could contain some link or access to VisitForm
    const [visits, setVisits] = useState([]);

    const auth = useContext(AuthContext);
    const user = auth.user;

    const jwtToken = auth.user.token;

    const loadVisits = () => {
        fetch(`http://localhost:8080/api/visit/sitter/${user.id}`, {
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
        </>
    )
}



export default ManageSitterVisits;
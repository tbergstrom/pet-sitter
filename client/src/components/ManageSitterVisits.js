import { useContext, useState, useEffect } from "react";
import VisitTable from "./VisitTable";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";

const ManageSitterVisits = () => {

    const [visits, setVisits] = useState([]);

    const auth = useContext(AuthContext);
    const user = auth.user;

    const jwtToken = auth.user.token;

    // Do we need to change this backend call to the token version? 
    const loadVisits = () => {
        fetchWithToken(`http://localhost:8080/api/visit/sitter/${user.id}`, auth.logout, {
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
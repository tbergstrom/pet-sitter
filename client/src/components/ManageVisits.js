import { useContext, useState, useEffect } from "react";
import VisitTable from "./VisitTable";
import AuthContext from "../contexts/AuthContext";
import VisitForm from "./VisitForm";
import fetchWithToken from "../utils/fetchUtils";
import { useNavigate } from "react-router";

const ManageVisits = ()=> {

    const [visits, setVisits] = useState([]);
    const [showVisitForm, setShowVisitForm] = useState(false);

    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = auth.user;

    const jwtToken = auth.user.token;

    const toggleForm = () => {
        setShowVisitForm(!showVisitForm);
    }

    const loadVisits = () => {

        let userRole = "";
        user.roles[0] === "SITTER" ? userRole = "sitter" : userRole = "owner";
        fetchWithToken(`http://localhost:8080/api/visit/${userRole}/my-visits`, auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(payload => setVisits(payload))
    };

    useEffect(loadVisits, [auth.logout, jwtToken, user.roles]);

    return (
        <>
            <h3>{user.username}'s Visits</h3>
            <VisitTable visits={visits} loadVisists={loadVisits} />
            {showVisitForm && <VisitForm visits={visits} setVisits={setVisits} loadVisits={loadVisits} toggleForm={toggleForm} />}
            
            <button onClick={toggleForm}>
                {showVisitForm ? "Cancel" : "Request a New Care Visit"}
            </button>
            {" "}
            <button onClick={() => navigate("/manageaccount")}>Back to Manage Account</button>
        </>
    )
}

export default ManageVisits;
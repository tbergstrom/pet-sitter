import { useContext, useState, useEffect } from "react";
import VisitTable from "./VisitTable";
import AuthContext from "../contexts/AuthContext";
import VisitForm from "./VisitForm";
import fetchWithToken from "../utils/fetchUtils";
import { useNavigate } from "react-router";
import { Container, Button } from 'react-bootstrap'


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
        <Container>
            <h3 className="my-5">{user.username}'s Visits</h3>
            <VisitTable visits={visits} loadVisits={loadVisits} />
            {showVisitForm && <VisitForm visits={visits} setVisits={setVisits} loadVisits={loadVisits} toggleForm={toggleForm} />}
            
            <Button variant="info" onClick={toggleForm}>
                {showVisitForm ? "Cancel" : "Request a New Care Visit"}
            </Button>
            {" "}
            <Button variant="warning" onClick={() => navigate("/manageaccount")}>Back to Manage Account</Button>
        </Container>
    )
}

export default ManageVisits;
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import ContactInfoDetails from "./ContactInfoDetails";
import ContactInfoForm from "./ContactInfoForm";
import fetchWithToken from "../utils/fetchUtils";
import { Container, Button } from "react-bootstrap";

const ManageContactInfo = ()=> {

    const [contactInfo, setContactInfo] = useState([]);
    const [showEditButton, setShowEditButton] = useState(false);

    const auth = useContext(AuthContext);
    const user = auth.user;
    const navigate = useNavigate();

    const jwtToken = auth.user.token;

    const toggleForm = () => {
        setShowEditButton(!showEditButton);
    }

    const loadContactInfo = () => {
        fetchWithToken(`http://localhost:8080/api/user/${user.id}`, auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(payload => setContactInfo(payload))
    };

    return (
        <Container>
            <h3 className="my-5">{user.username}'s Contact Info</h3>
            <ContactInfoDetails contactInfo={contactInfo} loadContactInfo={loadContactInfo} />
            {showEditButton && <ContactInfoForm contactInfo={contactInfo} setContactInfo={setContactInfo} loadContactInfo={loadContactInfo} toggleForm={toggleForm} />}
            
            <Button variant="info" onClick={toggleForm}>
                {showEditButton ? "Cancel" : "Edit"}
            </Button>
            {" "}
            <Button variant="warning" onClick={() => navigate("/manageaccount")}>Back to Manage Account</Button>
        </Container>
    )
}

export default ManageContactInfo;
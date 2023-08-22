import { useContext, useState, useEffect } from "react";
import VisitTable from "./VisitTable";
import AuthContext from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import VisitForm from "./VisitForm";
import ContactInfoDetails from "./ContactInfoDetails";
import ContactInfoForm from "./ContactInfoForm";

const ManageContactInfo = ()=> {

    const [contactInfo, setContactInfo] = useState([]);
    const [contactInfoCounter, setContactInfoCounter] = useState(contactInfo.length);
    const [showEditButton, setShowEditButton] = useState(false);

    
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();
    const user = auth.user;

    const jwtToken = auth.user.token;

    const toggleForm = () => {
        setShowEditButton(!showEditButton);
    }

    const loadContactInfo = () => {
        fetch(`http://localhost:8080/api/user/${user.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(payload => setContactInfo(payload))
    };

    // useEffect(loadContactInfo, []);

    return (
        <>
            <h3>{user.username}'s Contact Info</h3>
            <ContactInfoDetails contactInfo={contactInfo} loadContactInfo={loadContactInfo} />
            {showEditButton && <ContactInfoForm contactInfo={contactInfo} setContactInfo={setContactInfo} loadContactInfo={loadContactInfo} toggleForm={toggleForm} />}
            
            <button onClick={toggleForm}>
                {showEditButton ? "Cancel" : "Edit"}
            </button>
        </>
    )
}

export default ManageContactInfo;
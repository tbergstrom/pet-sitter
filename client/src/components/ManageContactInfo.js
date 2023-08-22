import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import ContactInfoDetails from "./ContactInfoDetails";
import ContactInfoForm from "./ContactInfoForm";
import fetchWithToken from "../utils/fetchUtils";

const ManageContactInfo = ()=> {

    const [contactInfo, setContactInfo] = useState([]);
    const [showEditButton, setShowEditButton] = useState(false);

    const auth = useContext(AuthContext);
    const user = auth.user;

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
        <>
            <h3>{user.username}'s Contact Info</h3>
            <ContactInfoDetails contactInfo={contactInfo} loadContactInfo={loadContactInfo} />
            {showEditButton && <ContactInfoForm contactInfo={contactInfo} setContactInfo={setContactInfo} loadContactInfo={loadContactInfo} toggleForm={toggleForm} />}
            
            <button onClick={toggleForm}>
                {showEditButton ? "Cancel" : "Edit"}
            </button>
            {" "}
            <button onClick={() => navigate("/manageaccount")}>Back to Manage Account</button>
        </>
    )
}

export default ManageContactInfo;
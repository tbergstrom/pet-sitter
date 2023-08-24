import { useNavigate, useParams, useLocation } from "react-router-dom";
import fetchWithToken from "../utils/fetchUtils";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { Button, Card, ListGroup, Container } from "react-bootstrap";

const VisitDetails = () => {
    const params = useParams();
    const auth = useContext(AuthContext);

    const [errors, setErrors] = useState([]);
    const [visit, setVisit] = useState(null);
    const [ownerDetails, setOwnerDetails] = useState(null);
    const [sitterDetails, setSitterDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWithToken(`http://localhost:8080/api/visit/singlevisit/${params.id}`, auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                setErrors(["Failed to fetch visit details"]);
                throw new Error("Failed to fetch visit details");
            }
            return response.json();
        })
        .then(payload => {
            setVisit(payload);

            // Fetch owner details
            fetchUserDetails(payload.ownerId, setOwnerDetails);

            // Fetch sitter details
            fetchUserDetails(payload.sitterId, setSitterDetails);
        })
        .catch(error => {
            setErrors([error.message]);
        });
    }, [auth.logout, params.id, auth.user.token]);

    const fetchUserDetails = (userId, setter) => {
        fetchWithToken(`http://localhost:8080/api/users/user/${userId}`, auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                setErrors(prev => [...prev, "Failed to fetch user details"]);
                throw new Error("Failed to fetch user details");
            } else {
                return response.json();
            }
        })
        .then(data => setter(data))
        .catch(error => {
            setErrors(prev => [...prev, error.message]);
        })
    };

    if (!visit) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            {/* If ownerDetails or sitterDetails are not yet fetched, display loading message */}
            {!ownerDetails || !sitterDetails ? (
                <p>Loading user details...</p>
            ) : (
                <>
                    <Card style={{ maxWidth: '95%', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Card.Header>
                            Visit Details
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>Status:</strong> {visit.status}</ListGroup.Item>
                            <ListGroup.Item><strong>Start:</strong> {visit.startDate}</ListGroup.Item>
                            <ListGroup.Item><strong>End:</strong> {visit.endDate}</ListGroup.Item>
                            <ListGroup.Item><strong>Owner:</strong> {ownerDetails.username}</ListGroup.Item>
                            <ListGroup.Item><strong>Sitter:</strong> {sitterDetails.username}</ListGroup.Item>
                            <ListGroup.Item><strong>Time:</strong> {visit.timeOfDay}</ListGroup.Item>
                            <ListGroup.Item><strong>Cost:</strong> {visit.cost}</ListGroup.Item>
                            <ListGroup.Item><strong>Notes:</strong> {visit.notes}</ListGroup.Item>
                        </ListGroup>
                    </Card>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'left', 
                        marginTop: '20px',
                        maxWidth: '95%', 
                        marginLeft: 'auto', 
                        marginRight: 'auto' 
                    }}>
                            <Button style={{ width: '33%' }} variant="warning" onClick={() => navigate("/managevisits")}>
                                Back to Visits
                            </Button>
                    </div>
                </>
            )}
        </Container>
    );
    
}

export default VisitDetails;
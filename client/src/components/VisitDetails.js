import { useNavigate, useParams } from "react-router-dom";
import fetchWithToken from "../utils/fetchUtils";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { Button, Card, ListGroup, Container } from "react-bootstrap";

const VisitDetails = () => {

    const params = useParams();
    const auth = useContext(AuthContext);

    const [errors, setErrors] = useState([]);
    const [visit, setVisit] = useState(null);
    const navigate = useNavigate();

    const loadVisitDetails = ()=> {
        fetchWithToken(`http://localhost:8080/api/visit/singlevisit/${params.id}`, auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                setErrors(["somethin happn"]) // CHANGE
            }
            if (response.headers.get('Content-Length') === '0') {
                return {};
            }
            return response.json();
        })
        .then(payload => setVisit(payload))
        .catch(error => {
            setErrors([error]);
        })
        
    }

    useEffect(loadVisitDetails, [auth.logout, params.id, auth.user.token])

    if (!visit) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            <Card style={{ maxWidth: '95%', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
                <Card.Header>
                    Visit Details
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item><strong>Status:</strong> {visit.status}</ListGroup.Item>
                    <ListGroup.Item><strong>Start:</strong> {visit.startDate}</ListGroup.Item>
                    <ListGroup.Item><strong>End:</strong> {visit.endDate}</ListGroup.Item>
                    <ListGroup.Item><strong>Owner:</strong> {visit.ownerId}</ListGroup.Item>
                    <ListGroup.Item><strong>Sitter:</strong> {visit.sitterId}</ListGroup.Item>
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
        </Container>
    )
}

export default VisitDetails;
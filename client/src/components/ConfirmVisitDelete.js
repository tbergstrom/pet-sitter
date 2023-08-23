import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";
import { Container, Button } from "react-bootstrap";

const ConfirmVisitDelete = ()=> {

const params = useParams();
const navigate = useNavigate();
const auth = useContext(AuthContext);

const [visit, setVisit] = useState(null);

useEffect(() => {
    fetchWithToken(`http://localhost:8080/api/visits/${params.id}`, auth.logout)
    .then(response => {
      if (response.ok) {
        if (response.headers.get('Content-Length') === '0') {
            return {};
        }
        response.json()
        .then(setVisit)
      } else {
        navigate("/not-found")
      }
    })
}, [params.id, auth.logout, navigate])

const handleDelete = () => {
    // Check if the authenticated user is the owner of the visit
    if (auth.user.id === visit.ownerId) {
        fetchWithToken(`http://localhost:8080/api/visits/${params.id}`, auth.logout, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + auth.user.token
            }
        })
        .then(response => {
            if (response.ok) {
                navigate("/visittable")
            } else {
                // set error here?
                console.log(`Unexpected response status code ${response.status}`);
            }
        })
    } else {
        console.log("You are not authorized to delete this visit.");
    }
}

// if no visit yet, don't attempt to render confirmation information
if (visit === null) {
    return null;
}

return ( 
    <Container>
        <h2>Confirm Delete</h2>
        <p>Cancel this Visit?</p>
        <ul>
            <li>Start Date: {visit.startDate}</li>
            <li>End Date: {visit.endDate}</li>
            <li>Notes: {visit.notes}</li>
        </ul>
        <Button variant="info" onClick={handleDelete}>Delete</Button>
        {" "}
        <Link className="btn btn-warning" to="/visittable">Cancel</Link>
    </Container>
);
}

export default ConfirmVisitDelete;
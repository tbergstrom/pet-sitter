import React, { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Container, Button, Table } from 'react-bootstrap'
import fetchWithToken from "../utils/fetchUtils";
import VisitRow from "./VisitRow";

const VisitTable = (props)=> {

    const auth = useContext(AuthContext);
    const user = auth.user;
    

    const handleDeny = (visitId)=> {
        updateVisitStatus(visitId, "Cancelled");
    }

    const handleConfirm = (visitId) => {
        updateVisitStatus(visitId, "Accepted");
    }

    const updateVisitStatus = (visit, status) => {
        const startDateISO = new Date(visit.startDate).toISOString();
        const endDateISO = new Date(visit.endDate).toISOString();

        
        const updatedVisit = { 
            ...visit, 
            status: status,
            startDate: startDateISO,
            endDate: endDateISO,
        }


        fetchWithToken(`http://localhost:8080/api/visit/singlevisit/${visit.careVisitId}`, auth.logout, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${auth.user.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedVisit)
        })
        .then(response => {
            if(response.ok) {
                props.loadVisits();
            }
        })
    }
    

    return (
        <Container>
            {/* Swaps between "visit" and "visits" depending on how many visits there are */}
            <h3>{props.visits.length} Upcoming {props.visits.length !== 1 ? <>Visits</> : <>Visit</>}</h3>
            <Table className="table table-striped">
                <thead>
                    <tr>
                        {/* A logged in Sitter will see an "Owner" column. A logged in Owner will see a "Sitter" column */}
                        {user.roles[0] === "OWNER" ? <th>Sitter</th> : <th>Owner</th>}
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Cost</th>
                        <th>Actions</th>
                        {/* Three empty column names, used for buttons. Too many? How can we streamline the "View Details/ Confirm/ Deny" options? */}
                    </tr>
                </thead>
                <tbody>
                    {props.visits.map(visit => 
                        <VisitRow 
                            key={visit.careVisitId} 
                            visit={visit} 
                            user={user} 
                            handleConfirm={handleConfirm} 
                            handleDeny={handleDeny} 
                        />
                    )}
                </tbody>
            </Table>
        </Container>
    )
    
}

export default VisitTable;
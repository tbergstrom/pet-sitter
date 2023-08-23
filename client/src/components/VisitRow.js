import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const VisitRow = ({ visit, user, handleConfirm, handleDeny }) => {
    const isSitter = user.roles[0] === "SITTER";
    const isOwner = user.roles[0] === "OWNER";

    const isVisitPending = visit.status === "Pending";
    const isVisitApproved = visit.status === "Accepted";

    return (
        <tr key={visit.careVisitId}>
            {isOwner ? <td>{visit.sitterId}</td> : <td>{visit.ownerId}</td>}
            <td>{visit.startDate}</td>
            <td>{visit.endDate}</td>
            <td>{visit.status}</td>
            <td>{visit.cost}</td>
            
            {/* Actions Cell */}
            <td>
                {/* For sitter with pending visit */}
                <Link to={`/visitdetails/${visit.careVisitId}`} style={{ textDecoration: 'none' }}>
                    <Button variant="primary">
                        <FontAwesomeIcon icon={faMagnifyingGlass} data-toggle="tooltip" data-placement="top" title="Details"/>
                    </Button>
                </Link>
                &nbsp;
                {isSitter && isVisitPending && 
                    <>
                        <Button onClick={()=> handleConfirm(visit)} variant="success">
                            <FontAwesomeIcon icon={faCheck} data-toggle="tooltip" data-placement="top" title="Accept"/>
                        </Button>
                        &nbsp; {/* Space between buttons */}
                        <Button onClick={()=> handleDeny(visit)} variant="danger">
                            <FontAwesomeIcon icon={faTimes} data-toggle="tooltip" data-placement="top" title="Deny"/>
                        </Button>
                        &nbsp;
                    </>
                }

                {/* Cancel action */}
                {(isOwner && (isVisitPending || isVisitApproved)) || (isSitter && isVisitApproved) &&
                    <Button onClick={()=> handleDeny(visit)} variant="danger">
                        <FontAwesomeIcon icon={faTimes} data-toggle="tooltip" data-placement="top" title="Cancel"/>
                    </Button>
                }

                {/* Details always available */}
                
                
            </td>
        </tr>
    );
}

export default VisitRow;

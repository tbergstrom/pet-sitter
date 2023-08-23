import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";

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
                {isSitter && isVisitPending && 
                    <>
                        <Button onClick={()=> handleConfirm(visit)} variant="success">
                            <FontAwesomeIcon icon={faCheck} />
                        </Button>
                        &nbsp; {/* Space between buttons */}
                        <Button onClick={()=> handleDeny(visit)} variant="danger">
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                        &nbsp;
                    </>
                }

                {/* Cancel action */}
                {(isOwner && (isVisitPending || isVisitApproved)) || (isSitter && isVisitApproved) &&
                    <Button onClick={()=> handleDeny(visit)} variant="danger">
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                }

                {/* Details always available */}
                &nbsp;
                <Button variant="info">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
            </td>
        </tr>
    );
}

export default VisitRow;

import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";
import { Link } from "react-router-dom";

const VisitRow = ({ visit, user, handleConfirm, handleDeny }) => {
    const [errors, setErrors] = useState([]);
    const [sitters, setSitters] = useState([])
    const [owners, setOwners] = useState([])
    const isSitter = user.roles[0] === "SITTER";
    const isOwner = user.roles[0] === "OWNER";
    const auth = useContext(AuthContext)

    const isVisitPending = visit.status === "Pending";
    const isVisitApproved = visit.status === "Accepted";

    useEffect(() => {
        if (isOwner) {
            const loadSitterDetails = () => {
                fetchWithToken(`http://localhost:8080/api/users/all-sitters`, auth.logout, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.user.token}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        setErrors(["Could not find sitters"]);
                    } else {
                        return response.json();
                    }
                })
                .then(payload => {
                    setSitters(payload);
                })
                .catch(error => {
                    setErrors([error]);
                });
            };
    
            loadSitterDetails();
        }
    
        if (isSitter) {
            const loadOwnerDetails = () => {
                fetchWithToken(`http://localhost:8080/api/users/all-owners`, auth.logout, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.user.token}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        setErrors(["Could not find owners"]);
                    } else {
                        return response.json();
                    }
                })
                .then(payload => {
                    setOwners(payload);
                })
                .catch(error => {
                    setErrors([error]);
                });
            };
    
            loadOwnerDetails();
        }
    }, []);
    

    return (
        <tr key={visit.careVisitId}>
          <td>
            {isOwner ? (
              sitters.find(sitter => sitter.appUserId === visit.sitterId)?.username || "Unknown Sitter"
              ) : (
              owners.find(owner => owner.appUserId === visit.ownerId)?.username || "Unknown Owner"
            )}
          </td>
            <td>{visit.startDate}</td>
            <td>{visit.endDate}</td>
            <td>{visit.status}</td>
            <td>${visit.cost}</td>
            
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
                {((isOwner && (isVisitPending || isVisitApproved)) || (isSitter && isVisitApproved)) &&
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

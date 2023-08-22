import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import fetchWithToken from "../utils/fetchUtils";

const VisitTable = ()=> {

    const [visits, setVisits] = useState([]);

    const auth = useContext(AuthContext);
    const user = auth.user;

    const jwtToken = auth.user.token;

    const loadVisits = () => {
        fetchWithToken(`http://localhost:8080/api/visit/sitter/${user.id}`, auth.logout, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => response.json())
        .then(payload => setVisits(payload))
    };

    useEffect(loadVisits, []);

    return (
        <>
            {/* Swaps between "visit" and "visits" depending on how many visits there are */}
            <h3>{visits.length} Upcoming {visits.length !== 1 ? <>Visits</> : <>Visit</>}</h3>
            <table>
                <thead>
                    <tr>
                        {/* A logged in Sitter will see an "Owner" column. A logged in Owner will see a "Sitter" column */}
                        {user.role === 1 ? <th>Sitter</th> : <th>Owner</th>}
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Cost</th> 
                        {/* Three empty column names, used for buttons. Too many? How can we streamline the "View Details/ Confirm/ Deny" options? */}
                        <th>&nbsp;</th>
                        <th>&nbsp;</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {visits.map(visit => <tr key={visit.visitId}>
                        {/* A logged in Sitter will see the Owner's name. A logged in Owner will see the Sitter's name */}
                        {user.role === 1 ? <td>{visit.sitterName}</td> : <td>{visit.ownerName}</td>}
                        <td>{visit.start}</td>
                        <td>{visit.end}</td>
                        <td>{visit.status}</td>
                        <td>{visit.cost}</td>
                        {user.role === 2 
                        ? 
                        <>
                            <td><button>Deny</button></td>
                            <td><button>Confirm</button></td>
                        </>  
                        :
                        null
                        }
                        
                        {/* The "Details" button would link to the full VisitDetails component and contact_info table */}
                        <td><button>Details</button></td>

                    </tr>)}
                </tbody>
            </table>
        </>
    )
}

export default VisitTable;
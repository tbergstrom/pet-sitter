import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const VisitTable = ({ visits })=> {

    const auth = useContext(AuthContext);
    const user = auth.user;

    return (
        <>
            {/* Swaps between "visit" and "visits" depending on how many visits there are */}
            <h3>{visits.length} Upcoming {visits.length !== 1 ? <>Visits</> : <>Visit</>}</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        {/* A logged in Sitter will see an "Owner" column. A logged in Owner will see a "Sitter" column */}
                        {user.roles[0] === "OWNER" ? <th>Sitter</th> : <th>Owner</th>}
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
                        {user.roles[0] === "OWNER" ? <td>{visit.sitterId}</td> : <td>{visit.ownerId}</td>}
                        <td>{visit.startDate}</td>
                        <td>{visit.endDate}</td>
                        <td>{visit.status}</td>
                        <td>{visit.cost}</td>
                        {user.roles[0] === "SITTER" 
                        ? 
                        <>
                            <td><button>Deny</button></td>
                            <td><button>Confirm</button></td>
                        </>  
                        :
                        <td><button>Details</button></td>
                        }
                        
                        {/* The "Details" button would link to the full VisitDetails component and contact_info table */}
                        
                        <td><button>Cancel</button></td>

                    </tr>)}
                </tbody>
            </table>
        </>
    )
}

export default VisitTable;
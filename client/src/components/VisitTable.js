import { Link } from "react-router-dom";

const VisitTable = ()=> {

// Direct child of ManageVisits (Owner AND Sitter)
// Parent of ConfirmVisitDelete and VisitDetails

// This component will show a User (owner OR sitter) their upcoming visits
// Sitters will have the option to confirm, deny, or view details of unconfirmed requests
// Owners will be able to see their upcoming visits and check status of requested visits

// Would be nice to separate or sort by pending/ confirmed visits


    // Fake visit
    const testVisit = {
        visitId: 1,
        ownerName: "jonnyboy",
        sitterName: "sallyJones",
        start: "jan",
        end: "feb",
        status: "pending",
        cost: 100.00,
        ownerId: 1,
        sitterId: 999
    }


    // Fake visit array
    const visits = [testVisit];

    // Fake user
    const someUser = {
        role: 1,
        name: "bob"
    }

    return (
        <>
            {/* Swaps between "visit" and "visits" depending on how many visits there are */}
            <h3>{visits.length} Upcoming {visits.length !== 1 ? <>Visits</> : <>Visit</>}</h3>
            <table>
                <thead>
                    <tr>
                        {/* A logged in Sitter will see an "Owner" column. A logged in Owner will see a "Sitter" column */}
                        {someUser.role === 1 ? <th>Sitter</th> : <th>Owner</th>}
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
                        {someUser.role === 1 ? <td>visit.sitterName</td> : <td>visit.ownerName</td>}
                        <td>visit.start</td>
                        <td>visit.end</td>
                        <td>visit.status</td>
                        <td>visit.cost</td>
                        <td><button>Confirm</button></td> 
                        <td><button>Deny</button></td>
                        {/* The "Details" button would link to the full VisitDetails component and contact_info table */}
                        <td><button>Details</button></td>

                    </tr>)}
                </tbody>
            </table>
        </>
    )
}

export default VisitTable;
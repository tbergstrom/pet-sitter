import React, { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const ManageAccount = ()=> {

// Direct Child of App.js
// Parent of ManageOwnerVisits, ManageSitterVisits, ManagePets

// Main overview of account for Owners & Sitters.
// Could conditionally render components based on role
// Basically a hub for managing visits and pets
const auth = useContext(AuthContext)
const user = auth.user;

console.log(user);

return (
    <>
        { user ? 
            (<div className="pet-details">
                <h2>Manage Your Account</h2>
                <Link to={`/managepets`}>Manage Your Pets</Link>
                {" "}
                <Link className="nav-btn" to={`/manageownervisits`}>Manage Your Visits</Link>
                {" "}
                <Link to={`/managecontactinfo`}>Manage Your Contact Info</Link>
                {" "}
            </div>)
            :
            (<p>...Loading</p>)
        }
    </>
    
);
}

export default ManageAccount;
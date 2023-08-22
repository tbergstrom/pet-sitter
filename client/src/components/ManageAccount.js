import React, { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const ManageAccount = ()=> {

    const auth = useContext(AuthContext)
    const user = auth.user;

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
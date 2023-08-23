import React, { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const ManageAccount = ()=> {

    const auth = useContext(AuthContext)
    const user = auth.user;

    return (
        <>
            { user ? 

                (<Container>
                    <div className="pet-details">
                        <h2 className="px-4 my-5">Manage Your Account</h2>
                        <Link className="btn btn-info" to={`/managepets`}>Manage Your Pets</Link>
                        {" "}
                        <Link className="btn btn-info" to={`/managevisits`}>Manage Your Visits</Link>
                        {" "}
                        <Link className="btn btn-info" to={`/managecontactinfo`}>Manage Your Contact Info</Link>
                        {" "}
                    </div>
                </Container>)

                :
                (<p>...Loading</p>)
            }
        </>
        
    );
}

export default ManageAccount;
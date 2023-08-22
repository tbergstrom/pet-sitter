import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const SitterTable = ({ sitters }) => {

    const auth = useContext(AuthContext);

    return (
        <>
            <h3>Sitters Near You</h3>
            {sitters && sitters.length ? (
                <>
                    <div className="d-flex justify-content-between"> 
                        {sitters.slice(0, 3).map(sitter => (
                            <div key={sitter.appUserId} className="card" style={{width: "18rem"}}>
                                {/* Need to have a pfp URL, prob in contact_info table */}
                                {/* <img src={sitter.pfpUrl} className="card-img-top" alt="" /> */}
                                <div className="card-body">
                                    <h5 className="card-title">{sitter.username}</h5>
                                    <p className="card-text">CARD TEMP TEXT</p>
                                    <p>Rate: {sitter.rate}</p>
                                    <p>
                                        <Link to={{
                                            pathname: `/user/sitter/${sitter.appUserId}`,
                                            state: { sitterFromTable: sitter }
                                        }}>View Details</Link>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                {/* <th>Profile</th> */}
                                <th>Username</th>
                                <th>Rate</th>
                                <th>Details</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sitters.slice(3).map(sitter => (
                                <tr key={sitter.appUserId}>
                                    {/* <td><img src={sitter.pfpUrl} className="card-img-top" alt="" /></td> */}
                                    <td>{sitter.username}</td>
                                    <td>{sitter.rate}</td>
                                    <td>
                                        <Link to={{
                                            pathname: `/user/sitter/${sitter.appUserId}`,
                                            state: { sitterFromTable: sitter }
                                        }}>View Details</Link>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>Please Enter Your Address to Find Nearby Sitters</p>
            )}
        </>
    )
}

export default SitterTable;

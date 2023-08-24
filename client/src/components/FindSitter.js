import React, { useContext, useState } from "react";
import SitterSearchBar from "./SitterSearchBar";
import SitterMap from "./SitterMap";
import SitterTable from "./SitterTable";
import { Button, Container } from "react-bootstrap";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const FindSitter = () => {
    const [location, setLocation] = useState(null);
    const [sitters, setSitters] = useState([]);
    const navigate = useNavigate();

    const auth = useContext(AuthContext);

    if (!auth.user) {
        return <Container>
        <h1>Please Login or Create an Account to Find Sitters Near You</h1>
        <Button variant="warning" onClick={() => navigate("/login")}>Login</Button>
        {" "}
        <Button variant="warning" onClick={() => navigate("/create_account")}>Create Account</Button>
        </Container>
    }
        return (
            <Container className="my-5">
                <SitterSearchBar setSitters={setSitters} setLocation={setLocation} />
                <SitterMap location={location} />
                <SitterTable location={location} sitters={sitters} />
            </Container>
        );
};

export default FindSitter;

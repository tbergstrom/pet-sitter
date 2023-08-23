import { useState } from "react";
import SitterSearchBar from "./SitterSearchBar";
import SitterMap from "./SitterMap";
import SitterTable from "./SitterTable";
import { Container } from "react-bootstrap";

const FindSitter = () => {
    const [location, setLocation] = useState(null);
    const [sitters, setSitters] = useState([]);

    return (
        <Container className="my-5">
            <SitterSearchBar setSitters={setSitters} setLocation={setLocation} />
            <SitterMap location={location} />
            <SitterTable location={location} sitters={sitters} />
        </Container>
    );
};

export default FindSitter;
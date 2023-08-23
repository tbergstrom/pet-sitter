import { useState } from "react";
import SitterSearchBar from "./SitterSearchBar";
import SitterMap from "./SitterMap";
import { useState } from "react";
import SitterTable from "./SitterTable";

const FindSitter = () => {
    const [location, setLocation] = useState(null);
    const [sitters, setSitters] = useState([]);

    return (
        <>
            <SitterSearchBar setSitters={setSitters} setLocation={setLocation} />
            <SitterMap location={location} />
            <SitterTable location={location} sitters={sitters} />
        </>
    );
};

export default FindSitter;
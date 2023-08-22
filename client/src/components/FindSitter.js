import { LoadScript } from "@react-google-maps/api";
import SitterSearchBar from "./SitterSearchBar";
import { useEffect, useState } from "react";
import SitterTable from "./SitterTable";
import SitterMap from "./SitterMap";

const FindSitter = ()=> {

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [sitters, setSitters] = useState([]);

    return (
        <>
        <SitterSearchBar onLocationSelect={setSelectedLocation} setSitters={setSitters}/>
        <SitterMap location={selectedLocation}/>
        <SitterTable location={selectedLocation} sitters={sitters}/>
        
        </>
    )
    
}

export default FindSitter;
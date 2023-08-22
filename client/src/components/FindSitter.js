import SitterSearchBar from "./SitterSearchBar";
import { useState } from "react";
import SitterTable from "./SitterTable";

const FindSitter = ()=> {

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [sitters, setSitters] = useState([]);

    return (
        <>
        <SitterSearchBar onLocationSelect={setSelectedLocation} setSitters={setSitters}/>
        <SitterTable location={selectedLocation} sitters={sitters}/>
        
        </>
    )
    
}

export default FindSitter;
import SitterSearchBar from "./SitterSearchBar";
import { useEffect, useState } from "react";
import SitterTable from "./SitterTable";
import SitterMap from "./SitterMap";

const FindSitter = ()=> {

    // const [mapsLoaded, setMapsLoaded] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [sitters, setSitters] = useState([]);

    // useEffect(()=> {
    //     const script = document.querySelector('script[src*="maps.googleapis.com"]');
    //     if (script) {
    //       script.addEventListener('load', ()=> setMapsLoaded(true));
    //       return ()=> script.removeEventListener("load", ()=> setMapsLoaded(true))
    //     }
    //   }, []);

    // const loadSitters = () => {
    //     fetch("http://localhost:8080/api/users/all-sitters")
    //     .then(response => response.json())
    //     .then(payload => setSitters(payload))
    //     console.log("Sitters: ", sitters);
    // }

    // useEffect(loadSitters, [])

    return (
        <>
        <SitterSearchBar onLocationSelect={setSelectedLocation} setSitters={setSitters}/>
        <SitterMap location={selectedLocation}/>
        <SitterTable location={selectedLocation} sitters={sitters}/>
        
        </>
    )
    
}

export default FindSitter;
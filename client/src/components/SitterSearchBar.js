import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../contexts/AuthContext";

const SitterSearchBar  = ({onLocationSelect})=> {
    const searchInputRef = useRef(null);
    const [address, setAddress] = useState("");

    const auth = useContext(AuthContext);
    const token = auth.user.token;

    const handleSearch = async ()=> {
        const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDb0qn-w3xq6Kk3m6Hkr3Y25GOSE-LA1aI`)
        const geoData = await geoResponse.json();

        console.log(geoResponse);

        if(geoData.results && geoData.results.length > 0) {
            const location = geoData.results[0].geometry.location
            
            const nearbyAddresses = await getNearbyAddresses(location);
            console.log("Nearby addresses:", nearbyAddresses);
        }
    }

    const getNearbyAddresses = async (location, token) => {
        const response = await fetch(`http://localhost:8080/api/users/nearby-sitters?lat=${location.lat}&lng=${location.lng}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        // const response = await fetch("http://localhost:8080/api/users/all-sitters");
        const data = await response.json();
        return data;
    }

    

    return (
        <div>
            <input type="text" value={address} onChange={(evt) => setAddress(evt.target.value)} placeholder="Enter address"/>
            <button onClick={handleSearch}>Search</button>
        </div>
    )

}

export default SitterSearchBar;
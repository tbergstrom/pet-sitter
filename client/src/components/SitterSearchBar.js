import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../contexts/AuthContext";

const SitterSearchBar  = (props)=> {
    const searchInputRef = useRef(null);
    const [address, setAddress] = useState("");
    const apiKey = process.env.REACT_APP_API_KEY;

    const auth = useContext(AuthContext);
    // const jwtToken = auth.user.token;

    useEffect(() => {
        if (auth.user === null) {
            return;
        }
        fetch("http://localhost:8080/api/users/all-sitters", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
            }
        })
        .then(response => response.json())
        .then(payload => props.setSitters(payload));
    }, [auth]);

    const handleSearch = async ()=> {
        const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)
        
        const geoData = await geoResponse.json();

        console.log("GeoResponse:", geoResponse);

        if(geoData.results && geoData.results.length > 0) {
            const location = geoData.results[0].geometry.location

            console.log("Location: ", location)
            
            const nearbyAddresses = await getNearbyAddresses(location);
            console.log("Nearby addresses:", nearbyAddresses);
        }
    }

    const getNearbyAddresses = async (location, token) => {
        const response = await fetch(`http://localhost:8080/api/users/nearby-sitters?lat=${location.lat}&lng=${location.lng}`, {
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
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
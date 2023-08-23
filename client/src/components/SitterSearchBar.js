import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../contexts/AuthContext";

const SitterSearchBar  = (props)=> {

    const [address, setAddress] = useState("");

    const [selectedDistance, setSelectedDistance] = useState(10);

    const apiKey = process.env.REACT_APP_API_KEY;

    const auth = useContext(AuthContext);
    // const jwtToken = auth.user.token;

    // useEffect(() => {
    //     if (auth.user === null) {
    //         return;
    //     }
    //     fetch("http://localhost:8080/api/users/all-sitters", {
    //         method: "GET",
    //         headers: {
    //             "Authorization": `Bearer ${auth.user.token}`
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(payload => props.setSitters(payload));
    // }, [auth]);

    const handleSearch = async ()=> {
        const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)


        const geoData = await geoResponse.json();

        console.log("GeoData:", geoData);

        if(geoData.results && geoData.results.length > 0) {
            const location = geoData.results[0].geometry.location

            console.log("Location: ", location)
            
            const nearbyAddresses = await getNearbyAddresses(location);
            console.log("Nearby addresses:", nearbyAddresses);
            props.setSitters(nearbyAddresses);

            props.setLocation(location);
        }
    }

    const getNearbyAddresses = async (location, token) => {

        const params = {
            lat: location.lat,
            lng: location.lng,
            distance: selectedDistance
        };

        const queryString = new URLSearchParams(params).toString();
        const url = `http://localhost:8080/api/users/nearby-sitters?${queryString}`
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${auth.user.token}`
            }
        });
        // const response = await fetch("http://localhost:8080/api/users/all-sitters");
        const data = await response.json();
        console.log("Backend fetch data :", data)
        return data;
    }

    

    return (
        <div>
            <input type="text" value={address} onChange={(evt) => setAddress(evt.target.value)} placeholder="Enter address"/>
            <button onClick={handleSearch}>Search</button>
            <select value={selectedDistance} onChange={(evt) => setSelectedDistance(evt.target.value)}>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
            </select>
        </div>
    )

}

export default SitterSearchBar;
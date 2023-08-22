import React, { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

const SitterSearchBar  = (props)=> {

    const [address, setAddress] = useState("");
    const [selectedDistance, setSelectedDistance] = useState(10);
    const apiKey = process.env.REACT_APP_API_KEY;

    const auth = useContext(AuthContext);

    const handleSearch = async ()=> {
        const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)
        const geoData = await geoResponse.json();

        if(geoData.results && geoData.results.length > 0) {
            const location = geoData.results[0].geometry.location

            const nearbyAddresses = await getNearbyAddresses(location);
            props.setSitters(nearbyAddresses);
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

        const data = await response.json();
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
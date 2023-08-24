import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { Loader } from "@googlemaps/js-api-loader";

const SitterMap = ({ location, sitters }) => {

    const markers = useRef([]);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    const [errors, setErrors] = useState([]);

    const initializeMap = () => {
        const initialLocation = {
            lat: 47.6205,
            lng: -122.3493,
        };

        const mapOptions = {
            center: initialLocation,
            zoom: 13,
        };

        mapInstance.current = new window.google.maps.Map(mapRef.current, mapOptions);

        if (location) {
            updateMapCenter(location);
            placeSitterMarkers();
        }
    };

    const updateMapCenter = (location) => {
        if (mapInstance.current) {
            mapInstance.current.setCenter(location);
        }
    };

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_API_KEY,
            version: "weekly",
        });

        loader.importLibrary('places').then(() => {
            window.google = window.google || {};
            initializeMap();
        });
    }, [location]);

    const resetMarkers = ()=> {
        for (let marker of markers.current) {
            marker.setMap(null);
        }
        markers.current = [];
    }

    const placeSitterMarkers = () => {
        resetMarkers();

        if (sitters && sitters.length > 0) {
            sitters.forEach(sitter => { 
                const contactInfo = sitter.contactInfo;
                if(contactInfo && contactInfo.latitude && contactInfo.longitude) {

                    const sitterLocation = {
                        lat: parseFloat(contactInfo.latitude), 
                        lng: parseFloat(contactInfo.longitude)
                    };

                    if (!sitterLocation.lat || !sitterLocation.lng || isNaN(sitterLocation.lat) || isNaN(sitterLocation.lng)) {
                        setErrors(prevErrors => [...prevErrors, 'Invalid address for sitter:' + sitter.name]);
                        return;
                    }
                    
                    const marker = new window.google.maps.Marker({
                        position: sitterLocation,
                        map: mapInstance.current,
                        title: sitter.name 
                    });
                    markers.current.push(marker);
                } else {
                    setErrors(prevErrors => [...prevErrors, "Invalid address for sitter:" + sitter.name]);
                }
            });
        }
    };
    

    useEffect(() => {
        if (mapInstance.current && location) {
            updateMapCenter(location);
            placeSitterMarkers();
        }
    }, [location, sitters, mapInstance.current]);

    return (
        <Container>
            <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
        </Container>
    );
};

export default SitterMap;

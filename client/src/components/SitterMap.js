import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { Loader } from "@googlemaps/js-api-loader";

const SitterMap = ({ location }) => {
    const mapRef = useRef(null);
    let map = null;

    const initializeMap = () => {
        const initialLocation = {
            lat: 47.6205,
            lng: -122.3493,
        };

        const mapOptions = {
            center: initialLocation,
            zoom: 13,
        };

        map = new window.google.maps.Map(mapRef.current, mapOptions);

        if (location) {
            updateMapCenter(location);
        }
    };

    const updateMapCenter = (location) => {
        if (map) {
            map.setCenter(location);
            const marker = new window.google.maps.Marker({
                position: location,
                map: map,
            });
        }
    };

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_API_KEY,
            version: "weekly",
        });

        loader.load().then(() => {
            window.google = window.google || {};
            initializeMap();
        });
    }, [location]);

    useEffect(() => {
        if (location) {
            updateMapCenter(location);
        }
    }, [location]);

    return (
        <Container>
            <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
        </Container>
    );
};

export default SitterMap;

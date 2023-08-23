import React, { useEffect, useRef } from "react";

const SitterMap = ({ location }) => {
    const mapRef = useRef(null);
    let map = null;

    const loadGoogleMapsScript = () => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
    };

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
        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            initializeMap();
        }
    }, [location]);

    useEffect(() => {
        if (location) {
            updateMapCenter(location);
        }
    }, [location]);

    return <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>;
};

export default SitterMap;

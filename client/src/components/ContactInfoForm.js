import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const ContactInfoForm = (props)=> {

    const params = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const apiKey = process.env.REACT_APP_API_KEY;
    // const user = auth.user;

    const [errors, setErrors] = useState([]);


    const [contactInfoId, setContactInfoId] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState("");
    const [contactInfo, setContactInfo] = useState([]);

    const states = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
    


    const resetState = ()=> {
        setContactInfo(0);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setStreetAddress("");
        setCity("");
        setState("");
        setZipCode("")
    }

    const jwtToken = auth.user.token;

    const loadContactInfo = () => {
        fetch(`http://localhost:8080/api/contact-info/user/my-info`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            if(!response.ok) {
                console.log("Response: ", response);
                setErrors(["Err: ", response.status])
            }
            return response.json()
        })
        .then(payload => setContactInfo(payload))
        .catch(error => {
            console.error("Fetch error: ", error);
            setErrors([error.message])
        })
    }
    
    useEffect(loadContactInfo, [])

    useEffect(() => {
        // Set the state values using the contactInfo prop when it changes
            setContactInfoId(contactInfo.contactInfoId);
            setFirstName(contactInfo.firstName);
            setLastName(contactInfo.lastName);
            setEmail(contactInfo.email);
            setPhoneNumber(contactInfo.phoneNumber);
            setStreetAddress(contactInfo.streetAddress);
            setCity(contactInfo.city);
            setState(contactInfo.state);
            setZipCode(contactInfo.zipCode);
    }, [contactInfo]);

    const handleSubmit = async (evt)=> {
        evt.preventDefault();

        const addressToConvert = `${streetAddress} ${city} ${state} ${zipCode}`;

        try {

            const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressToConvert)}&key=${apiKey}`)
            const geoData = await geoResponse.json();
    
            if(geoData.results && geoData.results.length > 0) {
                const location = geoData.results[0].geometry.location
    
                console.log("Location: ", location)
                
                const updatedContactInfo = {
                    contactInfoId: contactInfoId,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    streetAddress: streetAddress,
                    city: city,
                    state: state,
                    zipCode: zipCode,
                    latitude: location.lat,
                    longitude: location.lng
                };
    
                fetch(`http://localhost:8080/api/contact-info/${contactInfoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + auth.user.token
                },
                body: JSON.stringify(updatedContactInfo)
                })
                .then(response => {
                    if(response.ok) {
                        navigate(`/manageaccount`); // need params.id?
                        resetState();
                        // props.loadVisits();
                    } else {
                        console.log(updatedContactInfo.state);
                        response.json()
                        .then(errors => {
                            setErrors([errors])
                        })
                    }
                });
            } else {
                console.error("Geocoding error")
                setErrors(["Address could not be geocoded. Please try a different address."])
            }
        }catch (error) {
            console.error("Geocoding error: ", error);
            setErrors([`Failed to fetch coordinates. Error: ${error.message}`])
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
                <input
                    type="hidden"
                    value={contactInfoId}
                    onChange={(evt) => setContactInfoId(evt.target.value)}
                />
                <fieldset>
                    <label htmlFor="first-name-input">First Name: </label>
                    <input
                        id="first-name-input"
                        type="text"
                        value={firstName}
                        onChange={(evt) => setFirstName(evt.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="last-name-input">Last Name: </label>
                    <input
                        id="last-name-input"
                        type="text"
                        value={lastName}
                        onChange={(evt) => setLastName(evt.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="email-input">Email: </label>
                    <input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={(evt) => setEmail(evt.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="phone-number-input">Phone Number: </label>
                    <input
                        id="phone-number-input"
                        type="tel"
                        value={phoneNumber}
                        onChange={(evt) => setPhoneNumber(evt.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="street-address-input">Street Address: </label>
                    <input
                        id="street-address-input"
                        type="text"
                        value={streetAddress}
                        onChange={(evt) => setStreetAddress(evt.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="city-input">City: </label>
                    <input
                        id="city-input"
                        type="text"
                        value={city}
                        onChange={(evt) => setCity(evt.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="state-input">State: </label>
                    <select
                        id="state-input"
                        value={state}
                        onChange={(evt) => setState(evt.target.value)}
                    >
                        <option value="">Select a state</option>
                        {states.map((stateName, index) => (
                        <option key={index} value={stateName}>{stateName}</option>
                        ))}
                    </select>
                </fieldset>
                <fieldset>
                    <label htmlFor="zipcode-input">Zipcode: </label>
                    <input
                        id="zipcode-input"
                        type="text"
                        value={zipCode}
                        onChange={(evt) => setZipCode(evt.target.value)}
                    />
                </fieldset>
                <button type="submit">Save</button>
                <Link to="/manageaccount">Cancel</Link>
            </form>
        </>
    );
    


}

export default ContactInfoForm;
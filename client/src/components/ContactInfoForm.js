import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const ContactInfoForm = (props)=> {

    const params = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = auth.user;

    const [errors, setErrors] = useState([]);

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
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
        'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];


    const resetState = ()=> {
        setFirstName("");
        setLastName("");
    }

    const jwtToken = auth.user.token;

    // const loadContactInfo = () => {
    //     fetch(`http://localhost:8080/api/contact-info/user/my-info`, {
    //         method: "GET",
    //         headers: {
    //             "Authorization" : `Bearer ${jwtToken}`
    //         }
    //     })
    //     .then(response => {
    //         if(!response.ok) {
    //             console.log("Response: ", response);
    //             setErrors(["Err: ", response.status])
    //         }
    //         return response.json()
    //     })
    //     .then(payload => setContactInfo(payload))
    //     .catch(error => {
    //         console.error("Fetch error: ", error);
    //         setErrors([error.message])
    //     })
    //   }
    
    //   useEffect(loadContactInfo, [])

    const handleSubmit = (evt)=> {
        evt.preventDefault();

        const currentContactInfo = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            streetAddress: streetAddress,
            city: city,
            state: state,
            zipCode: zipCode
        }


        fetch(`http://localhost:8080/api/contact-info`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + auth.user.token
            },
            body: JSON.stringify(currentContactInfo)
        })
        .then(response => {
            if(response.ok) {
                navigate(`/managecontactinfo`); // need params.id?
                resetState();
                // props.loadVisits();
            } else {
                response.json()
                .then(errors => {
                    setErrors([errors])
                })
            }
        })
    }

    console.log(errors);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
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
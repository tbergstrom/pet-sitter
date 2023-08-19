import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";


const GoogleCallback = ()=> {
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();

    useEffect(()=> {
        const authCode = searchParams.get('code');

        console.log(authCode);

        if(authCode) {
            const sendToBackend = async ()=> {
                try {
                    const response = await fetch('http://localhost:8080/create_account_g', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ credential: authCode, role: "OWNER" })
                    });

                    console.log("Backend Response Status:", response.status);
                    const data = await response.json();
                    console.log("Backend Response Data:", data);

                    if (response.status === 201) {
                        navigate("/");
                    } else {
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Network error", error);
                    navigate("/login");
                }
            };

            sendToBackend();
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return <div>Processing...</div>

}

export default GoogleCallback;
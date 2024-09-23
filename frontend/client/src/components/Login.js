// Login.js

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {

    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const drfClientId = process.env.REACT_APP_DRF_CLIENT_ID;
    const drfClientSecret = process.env.REACT_APP_DRF_CLIENT_SECRET;
    const baseURL = "http://localhost:8000";
    async function handleGoogleLogin(credentialResponse) {
        const backend = "google-oauth2";
        const grant_type = "convert_token";
        const dateToSend = {
            token: credentialResponse.access_token,
            // backend: backend,
            // grant_type: grant_type,
            // client_id: drfClientId,
            // client_secret: drfClientSecret,
        };
        const newStringData = (JSON.stringify(dateToSend));
        const response = await fetch(`${baseURL}/auth/google-login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newStringData,
        });
        const dataFromApi = await response.json();
        localStorage.setItem("access_token", dataFromApi.access_token);
        localStorage.setItem("refresh_token", dataFromApi.refresh_token);
    }
    const login = useGoogleLogin({
        onSuccess: tokenResponse => handleGoogleLogin(tokenResponse),
        
    });

    return (

        <button onClick={() => login()}>
            Sign in with Google 🚀
        </button>

    );
};

export default Login;
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();  // Initialize useNavigate
    const baseURL = "http://localhost:8000";

    async function handleGoogleLogin(credentialResponse) {
        const dataToSend = {
            token: credentialResponse.access_token,
        };
        const newStringData = JSON.stringify(dataToSend);

        const response = await fetch(`${baseURL}/auth/google-login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newStringData,
        });

        const dataFromApi = await response.json();

        setIsAuthenticated(true);
        localStorage.setItem("access_token", dataFromApi.access_token);
        localStorage.setItem("refresh_token", dataFromApi.refresh_token);
        console.log(dataFromApi.access_token, dataFromApi.refresh_token)

        // Navigate to create-post after successful login
        navigate('/create-post');
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

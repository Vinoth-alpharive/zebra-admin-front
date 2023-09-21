// import axios from "axios";
import React from 'react';
import { useNavigate } from "react-router";

export default function Endpoints() {
    const history = useNavigate();

    // const validateAuthToken = async () => {
    //     const auth = cookies.auth;
    //     const { accessToken, refreshToken } = auth;
    //     if (Math.floor(Date.now() / 1000) < accessToken.exp) {
    //         return accessToken.token;
    //     } else if (Math.floor(Date.now() / 1000) < refreshToken.exp) {
    //         const getValidToken = await getRefreshToken(refreshToken.token);
    //         console.error(getValidToken)
    //         if (getValidToken && getValidToken.accessToken) {
    //             return getValidToken.accessToken.token;
    //         }
    //     } else {
    //         removeCookie("auth");
    //         history("/admin");
    //     }
    // }

    // const getCallWithoutAuthToken = async (data) => {
    //     const { url } = data;
    //     const rawResponse = await fetch(url, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //     return rawResponse;
    // }
    const getCall = async (data) => {
        const { url } = data;
        // const validateToken = await validateAuthToken();
        const validateToken = sessionStorage.getItem('accesstoken');
        const rawResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${validateToken}`
            },
        })
        return rawResponse;
    }
    const postCallWithoutAuthToken = async (data) => {
        const { url, payload } = data;
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        return rawResponse;
    }
    const postCall = async (data) => {
        const { url, payload } = data;
        // const validateToken = await validateAuthToken()
        const validateToken = sessionStorage.getItem('accesstoken');
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${validateToken}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            },
            body: JSON.stringify(payload)
        })
        return rawResponse;
    }
    const postCallTokenonly = async (data) => {
        const { url } = data;
        // const validateToken = await validateAuthToken()
        const validateToken = sessionStorage.getItem('accesstoken');
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${validateToken}`
            }
        })
        return rawResponse;
    }
    const putCall = async (data) => {
        const { url, payload } = data;
        // const validateToken = await validateAuthToken()
        const validateToken = sessionStorage.getItem('accesstoken');
        const rawResponse = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${validateToken}`
            },
            body: JSON.stringify(payload)
        })
        return rawResponse;
    }
    // const uploadImage = async (data) => {
    //     const { url, formData } = data;
    //     const auth = sessionStorage.getItem('auth');
    //     const token = JSON.parse(auth)
    //     const uploadResp = await axios.post(url, formData, {
    //         headers: {
    //             'authorization': `${token.accessToken}`,
    //         },
    //     })
    //     console.error(uploadResp)
    //     return uploadResp
    // }

    // const getRefreshToken = async (refreshToken) => {
    //     const url = "/adminapi/adminuser/refreshtoken"
    //     const rawResponse = await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': `${refreshToken}`
    //         },
    //     })
    //     console.error(rawResponse)
    //     const updateToken = await rawResponse.json();
    //     console.error(updateToken)
    //     setCookie('auth', JSON.stringify(updateToken.tokenObj));
    //     return updateToken.tokenObj;
    // }

    return {
        //  getCallWithoutAuthToken, 
        postCallWithoutAuthToken, getCall, postCall, putCall, postCallTokenonly,
        // getRefreshToken, uploadImage, 
    }
}

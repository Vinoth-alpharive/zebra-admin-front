import React, { useState, useEffect } from 'react';
import io from "socket.io-client";

export function Socket() {

    const [socket, setSocket] = useState(null);


    useEffect(() => {

        const newSocket = io("wss://letswinsports.io/service");
        setSocket(newSocket);
        newSocket.on("connection", () => {
            // console.log(newSocket.id);
        });

        // const newSocket = io("http://3.236.113.186")
        // const socket = newSocket?.on("connection", (socket) => {
        //     // console.log(socket, "socket")
        //     return socket
        // })


    }, [setSocket])

    return socket
}
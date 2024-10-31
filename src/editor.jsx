import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";

export default function App() {
    const [value, setValue] = useState("**Hello world!!!**");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create a WebSocket connection
        const newSocket = new WebSocket('ws://localhost:8000/ws');

        // Handle incoming messages
        newSocket.onmessage = (event) => {
            const newValue = event.data;
            if (newValue !== value) {
                setValue(newValue); // Update state if the value is different
            }
        };

        setSocket(newSocket);

        // Cleanup on component unmount
        return () => {
            newSocket.close();
        };
    }, []);

    const handleChange = (newValue) => {
        setValue(newValue);

        // Send updated value to the server via WebSocket
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(newValue);
        }
    };

    return (
        <div className="container">
            <MDEditor
                value={value}
                onChange={handleChange}
                preview="live"  
            />
            {/* <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
        </div>
    );
}

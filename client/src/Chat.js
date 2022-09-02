import { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
import io from "socket.io-client";

let socket;

const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

const disconnect = () => (socket = null);

export default function Chat() {
    // const onRecentMessages = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    useEffect(() => {
        const socket = connect();
        function onRecentMessages(incomingMessages) {
            console.log("onRecentMessages", incomingMessages);
            setChatMessages(incomingMessages);
        }

        function onBroadcastMessages(message) {
            console.log("onBroadcastMessages", message);
            setChatMessages((chatMessages) => {
                return [...chatMessages, message];
            });
        }

        socket.on("recentMessages", onRecentMessages);
        socket.on("broadcastMessages", onBroadcastMessages);

        return () => {
            socket.off("recentMessages", onRecentMessages);
            socket.off("broadcastMessage", onBroadcastMessages);
            disconnect();
        };
    }, []);

    function onSubmit(event) {
        event.preventDefault();
        const socket = connect();
        socket.emit("New Message", event.target.message.value);
        console.log("new message value", event.target.message.value);
        event.target.message.value = "";
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            <ul className="messages">
                {chatMessages.map((chat) => (
                    <li key={chat.id}>
                        <img src={chat.profile_pic_url} />
                        {chat.first_name} {chat.last_name}
                        <p>{chat.message}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={onSubmit}>
                <textarea
                    name="message"
                    rows={1}
                    placeholder="Write your message..."
                    required
                ></textarea>
                <button>Send</button>
            </form>
        </section>
    );
}

import { useState, useEffect } from "react";
import FriendList from "./friendList";

export default function Friends() {
    const [friendships, setFriendships] = useState([]);

    useEffect(() => {
        fetch("/api/friendships").then((response) =>
            response.json().then((result) => {
                setFriendships(result);
            })
        );
    }, []);

    const incoming = friendships.filter((friendship) => !friendship.accepted);
    const accepted = friendships.filter((friendship) => friendship.accepted);

    function onClickAccept(event) {
        fetch("/api/accept-request/" + event.id, {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const updatedFriendships = friendships.map((friendship) => ({
            ...friendship,
            accepted: friendship.id === event.id ? true : friendship.accepted,
        }));
        setFriendships(updatedFriendships);
    }

    function onClickDeny(event) {
        fetch("/api/cancel-request/" + event.id, {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const updatedFriendships = friendships.filter(
            (friendship) => friendship.id !== event.id
        );
        setFriendships(updatedFriendships);
        return;
    }

    return (
        <section>
            <div className="containerOfFriends">
                <h1>Friends</h1>
                <section>
                    <h3>Friend Requests</h3>
                    <FriendList
                        friendships={incoming}
                        onClick={onClickAccept}
                    />
                </section>
                <section>
                    <h3>My Friends</h3>
                    <FriendList friendships={accepted} onClick={onClickDeny} />
                </section>
            </div>
        </section>
    );
}

import { useState, useEffect } from "react";

export default function FriendshipButton(props) {
    const [buttonText, setButtonText] = useState("default btn text");
    const otherUserId = props.otherUserId;

    useEffect(() => {
        fetch("/api/friendship-status/" + otherUserId)
            .then((response) => response.json())
            .then((result) => {
                setButtonText(result);
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }, []);

    function handleClick() {
        if (buttonText === "Make Friend Request") {
            fetch("/api/make-request/" + otherUserId, {
                method: "POST",
                body: JSON.stringify({
                    buttonText: buttonText,
                }),
                headers: { "Content-Type": "application/json" },
            }).then(() => setButtonText("Cancel Friend Request"));
        } else if (
            buttonText == "Cancel Friend Request" ||
            buttonText == "End Friendship"
        ) {
            fetch("/api/cancel-request/" + otherUserId, {
                method: "POST",
                body: JSON.stringify({
                    buttonText: buttonText,
                }),
                headers: { "Content-Type": "application/json" },
            }).then(() => setButtonText("Make Friend Request"));
        } else if (buttonText === "Accept Friend Request") {
            fetch("/api/accept-request/" + otherUserId, {
                method: "POST",
                body: JSON.stringify({
                    buttonText: buttonText,
                }),
                headers: { "Content-Type": "application/json" },
            }).then(() => setButtonText("End Friendship"));
        }
    }

    return <button onClick={handleClick}>{buttonText}</button>;
}

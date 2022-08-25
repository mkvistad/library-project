import { useState, useEffect } from "react";

export default function FriendshipButton(props) {
    console.log("props", props);
    const [buttonText, setButtonText] = useState("default btn text");
    const otherUserId = props.otherUserId;
    console.log("Other user ID", otherUserId);

    useEffect(() => {
        console.log("friendship btn mounted!");
        fetch("/api/friendship-status/" + otherUserId)
            .then((response) => response.json())
            .then((result) => {
                console.log("result in useEffect: ", result);
                setButtonText(result);
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }, []);

    function handleClick() {
        console.log("clicked on the button");
        if (buttonText === "Make Friend Request") {
            setButtonText("Cancel Friend Request");
        } else if (buttonText === "Cancel Friend Request") {
            setButtonText("Send Friend Request");
        } else if (buttonText === "End Friendship") {
            setButtonText("Send Friend Request");
        } else if (buttonText === "Accept Friend Request") {
            setButtonText("End Friendship");
        }
    }

    return <button onClick={handleClick}>{buttonText}</button>;
}

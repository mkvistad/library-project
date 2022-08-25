import { useState, useEffect } from "react";

export default function FriendshipButton(props) {
    console.log("props", props);
    const [buttonText, setButtonText] = useState("default btn text");
    // const otherUserId = 55;

    useEffect(() => {
        console.log("friendship btn mounted!");
        fetch("/api/friendship-status/" + props.otherUserId)
            .then((response) => response.json())
            .then((result) => {
                console.log("result in useEffect: ", result);
                setButtonText(result);
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }, []);

    // function handleClick() {
    //     console.log("clicked on the button");
    //2 options if else chain and based on text make post req to route
    //     if (buttonText === "Make Friend Request") {
    //         fetch("/api/add-friend", method: "POST", body: otherUserId )
    //     } else if (buttonText === "Cancel Friend Request") {
    //         //delete api or accept api
    //     }
    // }

    return <button>{buttonText}</button>;
}

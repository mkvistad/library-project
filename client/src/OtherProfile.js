import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import ProfilePicture from "./profilepicture";
import FriendshipButton from "./FriendshipButton";

export default function OtherProfile() {
    const { user_id } = useParams();
    console.log("user_id other profile", user_id);
    const [user, setUser] = useState({});
    const history = useHistory();

    useEffect(() => {
        fetch("/api/users/" + user_id)
            .then((response) => response.json())
            .then((data) => {
                return data ? setUser(data) : history.push("/");
            });
    }, [user_id]);

    // otherUserId(() => {
    //     fetch("/api/users/" + otherUserId)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             return data ? setUser(data) : history.push("/");
    //         });
    // }, [otherUserId]);

    if (!user) {
        return null;
    }

    return (
        <div className="profile">
            <div className="profiledetails">
                <ProfilePicture {...user} />
                <h3>
                    {user.first_name} {user.last_name}
                </h3>
                <h2>Bio</h2>
                <p className="bioOthers">{user.bio}</p>
                <FriendshipButton otherUserId={user_id} />
            </div>
        </div>
    );
}

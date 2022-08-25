import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import ProfilePicture from "./profilepicture";

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

    return (
        <div>
            <ProfilePicture {...user} />
            <p>
                {user.first_name} {user.last_name}
            </p>
            <p>{user.bio}</p>
        </div>
    );
}

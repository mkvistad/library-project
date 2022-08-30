import { NavLink } from "react-router-dom";

export default function FriendList({ friendships, onClick }) {
    console.log(friendships);
    return (
        <ul>
            {friendships.map((friendship) => (
                <li key={friendship.id}>
                    <div className="pictureFriends">
                        <img
                            className="allUsers"
                            src={friendship.profile_pic_url}
                        />
                        <div className="friendNames">
                            <p className="upperMarginArea">
                                <NavLink to={`/users/${friendship.id}`}>
                                    {friendship.first_name}{" "}
                                    {friendship.last_name}
                                </NavLink>
                            </p>
                            <button onClick={() => onClick(friendship)}>
                                {friendship.accepted
                                    ? "End Friendship"
                                    : "Accept Friendship"}
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

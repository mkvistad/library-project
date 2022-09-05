import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// import ProfilePicture from "./profilepicture";

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/users/recent")
            .then((response) => response.json())
            .then((data) => setRecentUsers(data));
    }, []);

    useEffect(() => {
        if (searchTerm.length < 1) {
            return;
        }
        fetch("/api/users/search?q=" + searchTerm)
            .then((response) => response.json())
            .then((data) => setSearchResults(data));
    }, [searchTerm]);

    function somethingChangesHere(event) {
        setSearchTerm(event.target.value);
    }

    function FindUsers(props) {
        const users = props.users;
        {
            return users.map((user) => (
                <ul key={user.id}>
                    <img
                        className="profile-picture"
                        src={user.profile_pic_url || "/profilepic.jpeg"}
                        alt="user profile picture"
                    />
                    <NavLink to={"/users/" + user.id}>
                        {user.first_name} {user.last_name}
                    </NavLink>
                </ul>
            ));
        }
    }

    return (
        <section className="find-people">
            <h2>Find People</h2>
            <section className="recent-users">
                <h3>Who is new?</h3>
                {recentUsers.map((user) => (
                    <ul className="containerprofilepic" key={user.id}>
                        <div className="containerprofilepicitem">
                            <img
                                className="profile-picture"
                                src={user.profile_pic_url || "/profilepic.jpeg"}
                                alt="user profile picture"
                            />{" "}
                        </div>
                        <NavLink to={"/users/" + user.id}>
                            {user.first_name} {user.last_name}
                        </NavLink>
                    </ul>
                ))}
            </section>
            <section className="search-results">
                <h3>Looking for someone in particular?</h3>
                <p>
                    <input
                        defaultValue={searchTerm}
                        onChange={somethingChangesHere}
                        placeholder="Search for users..."
                    />
                </p>
                <FindUsers users={searchResults} />
            </section>
        </section>
    );
}

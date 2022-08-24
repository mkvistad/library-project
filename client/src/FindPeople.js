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

    // this other useEffect is needed to react to the search term change:
    useEffect(() => {
        // if the searchTerm is too short, exit the function!
        if (searchTerm.length < 1) {
            return;
        }
        // make an ajax call to '/api/users/search?q=' + searchTerm
        fetch("/api/users/search?q=" + searchTerm)
            // then update the search results state with the results
            .then((response) => response.json())
            .then((data) => setSearchResults(data));
    }, [searchTerm]);

    function somethingChangesHere(event) {
        setSearchTerm(event.target.value);
    }

    function findUsers(props) {
    const users = props.users;
    {
        users.map((user)=> (
           <ul key={user.id}>
                        <img
                            className="profile-picture"
                            src={profile_pic_url || "/profilepic.jpeg"}
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
                    <ul key={user.id}>
                        <img
                            className="profile-picture"
                            src={profile_pic_url || "/profilepic.jpeg"}
                            alt="user profile picture"
                        />
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
                <findUsers users={searchResults}
            </section>
        </section>
    );
}



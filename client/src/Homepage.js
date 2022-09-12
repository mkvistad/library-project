import { NavLink } from "react-router-dom";

export default function homepage() {
    return (
        <main className="homepage">
            <section className="intro">
                <h1>Welcome to the Book Vault</h1>
                <NavLink to={"/FindBooks/"}>
                    <button className="start">Begin Here</button>
                </NavLink>
            </section>
            <img className="introimage" src="/Library.jpg" />
            <section className="footer">
                <div className="currentReads">
                    <p>
                        Michele is curerntly reading:{" "}
                        {
                            "Fierce Invalids Home from Hot Climates by Tom Robbins"
                        }
                    </p>
                    <img className="current-book" src="/FierceRobbins.jpeg" />
                </div>
                <div className="faveBooks">
                    <h2>Top Books...</h2>
                    <ul>
                        <li>Silent Spring by Rachel Carson</li>
                        <li>The Scarlet Letter by Nathaniel Hawthorne</li>
                        <li>On the Road by Jack Kerouac</li>
                        <li>
                            Love in the Time of Cholera by Gabriel Garcia
                            Marquez
                        </li>
                        <li>Where the Sidewalk Ends by Shel Silverstein</li>
                    </ul>
                </div>
            </section>
        </main>
    );
}

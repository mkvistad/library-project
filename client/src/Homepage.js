import { BrowserRouter } from "react-router-dom";
import FindBooks from "./FindBooks";
import { NavLink } from "react-router-dom";

export default function homepage() {
    return (
        <main className="homepage">
            <section className="welcome">
                <h1>Welcome to the Book Vault</h1>
                <NavLink to={"/FindBooks/"}>
                    <button className="start">Begin Here</button>
                </NavLink>
            </section>
            <section className="currentReads">
                <h2>
                    Michele is curerntly reading:{" "}
                    {"Fierce Invalids Home from Hot Climates by Tom Robbins"}
                </h2>
                <img className="current-book" src="/FierceRobbins.jpg" />
            </section>
            <section className="faveBooks">
                <h2>Top Books...</h2>
                <ul>
                    <li>Silent Spring by Rachel Carson</li>
                    <li>The Scarlet Letter by Nathaniel Hawthorne</li>
                    <li>On the Road by Jack Kerouac</li>
                    <li>
                        Love in the Time of Cholera by Gabriel Garcia Marquez
                    </li>
                    <li>Where the Sidewalk Ends by Shel Silverstein</li>
                </ul>
            </section>
        </main>
    );
}

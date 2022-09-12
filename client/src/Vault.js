import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function VaultBooks() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log("fetching!");
        fetch("/api/books/test")
            .then((response) => response.json())
            .then((data) => setSearchResults(data));
    }, []);

    function somethingChangesHere(event) {
        setSearchTerm(event.target.value);
    }

    function VaultBooks(props) {
        const books = props.books;
        {
            return books.map((book) => (
                <ul key={book.id}>
                    <li>
                        <NavLink to={"/Books/" + book.id}>
                            <img
                                className="book-cover"
                                src={
                                    book.imagelinks || "/LibraryPlaceholder.jpg"
                                }
                                alt="book cover"
                            />
                            {book.title}, {book.author}
                        </NavLink>
                    </li>
                </ul>
            ));
        }
    }

    return (
        <section className="Vault">
            <h2>The Vault</h2>
            <section className="VaultBooks">
                <h3></h3>
            </section>
            <section className="search-results">
                <h3>?</h3>
                <p>
                    <input
                        defaultValue={searchTerm}
                        onChange={somethingChangesHere}
                        placeholder="Find something to read..."
                    />
                </p>
                <VaultBooks books={searchResults} />
            </section>
        </section>
    );
}

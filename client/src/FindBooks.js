import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function FindBooks() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (searchTerm.length < 1) {
            return;
        }
        fetch("/api/books/search?q=" + searchTerm)
            .then((response) => response.json())
            .then((data) => setSearchResults(data));
    }, [searchTerm]);

    function somethingChangesHere(event) {
        setSearchTerm(event.target.value);
    }

    function FindABook(props) {
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
            <section className="DiscoverBooks">
                <h3>Discover a new world </h3>
            </section>
            <section className="search-results">
                <h3>Looking for something in particular?</h3>
                <p>
                    <input
                        defaultValue={searchTerm}
                        onChange={somethingChangesHere}
                        placeholder="Find something to read..."
                    />
                </p>
                <FindABook books={searchResults} />
            </section>
        </section>
    );
}

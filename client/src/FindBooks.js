import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function FindBooks() {
    const [titleSearchResults, settitleSearchResults] = useState([]);
    const [authorSearchResults, setAuthorSearchResults] = useState([]);
    const [titleSearchInput, settitleSearchInput] = useState("");
    const [authorSearchInput, setAuthorSearchInput] = useState("");

    useEffect(() => {
        if (titleSearchInput.length < 1) {
            return;
        }
        fetch("/api/books/search?q=" + titleSearchInput)
            .then((response) => response.json())
            .then((data) => settitleSearchResults(data));
    }, [titleSearchInput]);

    useEffect(() => {
        if (authorSearchInput.length < 1) {
            return;
        }
        fetch("/api/books/author/search?q=" + authorSearchInput)
            .then((response) => response.json())
            .then((data) => setAuthorSearchResults(data));
    }, [authorSearchInput]);

    function FindABook(props) {
        console.log("PROPS: ", props);
        const books = props.books;

        {
            return (
                <>
                    {books.map((book) => (
                        <div key={book.id}>
                            <NavLink to={"/Books/" + book.id}>
                                <img
                                    className="book-cover"
                                    src={
                                        book.imagelinks ||
                                        "/LibraryPlaceholder.jpg"
                                    }
                                    alt="book cover"
                                />
                                {book.title}, {book.authors}
                            </NavLink>
                        </div>
                    ))}
                </>
            );
        }
    }

    function FindAuthor(props) {
        console.log("PROPS: ", props);
        const books = props.books;

        {
            return (
                <>
                    {books.map((book) => (
                        <div key={book.id}>
                            <NavLink to={"/Authors/" + book.authors}>
                                <img
                                    className="book-cover"
                                    src={
                                        book.imagelinks ||
                                        "/LibraryPlaceholder.jpg"
                                    }
                                    alt="book cover"
                                />
                                {book.title}, {book.authors}
                            </NavLink>
                        </div>
                    ))}
                </>
            );
        }
    }

    function saveInput(e) {
        settitleSearchInput(e.target.value);
    }

    function saveAuthorInput(e) {
        setAuthorSearchInput(e.target.value);
    }
    return (
        <main>
            <img className="libraryStairs" src="/LibraryStairs.jpg"></img>
            <div className="findbooks">
                {" "}
                <section className="Vault">
                    <h1>Would you </h1>
                    <h1>like to</h1>
                    <h2>look inside</h2>
                    <h2>The Vault?</h2>
                    <section className="DiscoverBooks">
                        <h3>Discover other worlds </h3>

                        <input
                            onChange={saveInput}
                            placeholder="Find by Title..."
                        ></input>

                        <FindABook books={titleSearchResults} />

                        <input
                            onChange={saveAuthorInput}
                            placeholder="Find by Author..."
                        ></input>

                        <FindAuthor books={authorSearchResults} />
                    </section>

                    <section className="VaultLink">
                        <h3>Still undecided?</h3>
                        <button>
                            <NavLink to={"/Vault"} className="extras-button">
                                Step into the Vault
                            </NavLink>
                        </button>
                    </section>

                    <section className="returnHome">
                        <h3>Back to the beginning</h3>
                        <button>
                            <NavLink to={"/"}>Return to the homepage</NavLink>
                        </button>
                    </section>

                    <section className="Extras">
                        <h3>Coming soon...</h3>
                        <button>
                            <NavLink to={"/Extras"} className="extras-button">
                                ...
                            </NavLink>
                        </button>
                    </section>
                </section>
            </div>
        </main>
    );
}

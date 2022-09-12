import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function AuthorDetails() {
    const { book_authors } = useParams();
    const [books, setBooks] = useState();
    const history = useHistory();

    useEffect(() => {
        fetch("/api/authors/" + book_authors)
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                return data ? setBooks(data) : history.push("/");
            });
    }, []);

    if (!books) {
        return null;
    }

    return (
        <>
            {books.map((book) => (
                <div key={book.id}>
                    <NavLink to={"/Books/" + book.id}>
                        <img
                            className="book-cover"
                            src={book.imagelinks || "/LibraryPlaceholder.jpg"}
                            alt="book cover"
                        />
                        {book.title}, {book.authors}
                    </NavLink>
                </div>
            ))}
        </>
    );
}

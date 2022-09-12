import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function BookDetails() {
    const { book_id } = useParams();
    const [book, setBook] = useState({});
    const history = useHistory();

    useEffect(() => {
        fetch("/api/books/" + book_id)
            .then((response) => response.json())
            .then((data) => {
                return data ? setBook(data) : history.push("/");
            });
    }, [book_id]);

    if (!book) {
        return null;
    }

    return (
        <div className="details">
            <div className="book-details">
                <div className="book-cover-large">
                    <img src={book.imagelinks || "/LibraryPlaceholder.jpg"} />
                </div>
                <h3>
                    {book.title}, {book.authors}
                </h3>
                <h2>Info</h2>
                <div className="book-info">
                    {book.description && <p>Description: {book.description}</p>}
                    {book.publishedDate && (
                        <p>Published: {book.publishedDate}</p>
                    )}
                    {book.pageCount && <p>Pages: {book.pageCount}</p>}
                    {book.categories && <p>Categories: {book.categories}</p>}
                    {book.maturityRating && (
                        <p>Maturity Rating: {book.maturityRating}</p>
                    )}
                    {book.language && (
                        <p>
                            Language:
                            {book.language === "en" && " English"}
                            {book.language === "de" && " German"}
                            {book.language === "es" && " Spanish"}
                            {book.language === "sv" && " Swedish"}
                        </p>
                    )}

                    {book.infoLink && <a href={book.infoLink}>More Info</a>}
                    <button>
                        <NavLink to={"/"}>Return to the search</NavLink>
                    </button>
                </div>
            </div>
        </div>
    );
}

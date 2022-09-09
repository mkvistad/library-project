import { BrowserRouter, Route } from "react-router-dom";
// import "./LibraryApp.css";
// import Header from "./components/Header/Header";
// import Books from "./Books";
// import Search from "./Pages/Search/Search";

import { useEffect, useState } from "react";

export default function App() {
    const [bookData, setBookData] = useState([]);
    console.log("book data", bookData);
    useEffect(() => {
        fetch(`/api/books/`)
            .then((result) => result.json())
            .then((data) => {
                setBookData(data);
            })
            .catch((error) => {
                console.log("error in mounted: ", error);
            });
    }, []);

    return (
        <>
            <BrowserRouter>
                <div className="app">
                    <Route path="/" exact />
                    <h1>This is App</h1>
                    <ul>
                        {bookData.map((book) => (
                            <li key={book.id}>
                                {book.title}
                                <img src={book.imagelinks}></img>
                            </li>
                        ))}
                    </ul>
                    <Route path="/Books" />
                    <Route path="/Authors" />
                    <Route path="/search" />
                </div>
            </BrowserRouter>
        </>
    );
}

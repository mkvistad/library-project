import { BrowserRouter, Route } from "react-router-dom";
// import "./LibraryApp.css";
// import Header from "./components/Header/Header";
// import Books from "./Books";
// import Search from "./Pages/Search/Search";
import FindBooks from "./FindBooks";
import BookDetails from "./BookDetails";

// import { useEffect, useState } from "react";

export default function App() {
    // const [bookData, setBookData] = useState([]);
    // console.log("book data", bookData);
    // useEffect(() => {
    //     fetch(`/api/books/`)
    //         .then((result) => result.json())
    //         .then((data) => {
    //             setBookData(data);
    //         })
    //         .catch((error) => {
    //             console.log("error in mounted: ", error);
    //         });
    // }, []);

    return (
        <>
            <BrowserRouter>
                <div className="app">
                    <Route path="/" exact />
                    <FindBooks />
                    <Route path="/Authors" />
                    <Route path="/search" />
                    <Route path="/books/:book_id">
                        <BookDetails />
                    </Route>
                </div>
            </BrowserRouter>
        </>
    );
}

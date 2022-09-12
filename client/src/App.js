import { BrowserRouter, Route } from "react-router-dom";
// import "./LibraryApp.css";
// import Header from "./components/Header/Header";
// import Books from "./Books";
// import Search from "./Pages/Search/Search";
import FindBooks from "./FindBooks";
import BookDetails from "./BookDetails";
import AuthorDetails from "./AuthorDetails";
import ExtraFeatures from "./ExtraFeatures";
import Homepage from "./Homepage";
import VaultBooks from "./Vault";

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
                    <Route exact path="/findBooks">
                        <FindBooks />
                    </Route>
                </div>

                <div className="app">
                    <Route exact path="/">
                        <Homepage />
                    </Route>
                </div>

                <div className="app">
                    <Route exact path="/Vault">
                        <VaultBooks />
                    </Route>
                </div>

                <div>
                    <Route exact path="/Books/:book_id">
                        <BookDetails />
                    </Route>
                </div>
                <div>
                    <Route exact path="/Authors/:book_authors">
                        <AuthorDetails />
                    </Route>
                </div>
                <div>
                    <Route exact path="/Extras/">
                        <ExtraFeatures />
                    </Route>
                </div>
            </BrowserRouter>
        </>
    );
}

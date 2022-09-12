import { BrowserRouter, Route } from "react-router-dom";
import FindBooks from "./FindBooks";
import BookDetails from "./BookDetails";
import AuthorDetails from "./AuthorDetails";
import ExtraFeatures from "./ExtraFeatures";
import Homepage from "./Homepage";
import VaultBooks from "./Vault";

export default function App() {
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

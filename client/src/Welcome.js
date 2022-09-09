import { BrowserRouter, Route } from "react-router-dom";
import LoginForm from "./LoginForm.js";

export default function Welcome() {
    return (
        <div className="welcome">
            <img className="Library" src="/Lirary.jpg" />
            <link
                href="//db.onlinewebfonts.com/c/f5a0fdbad9ec5d2a9154ec76383ac111?family=Zen+1"
                rel="stylesheet"
                type="text/css"
            />
            <h1>Welcome to the Book Vault</h1>

            <BrowserRouter>
                <div>
                    <Route path="/">
                        <LoginForm />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}

import { BrowserRouter, Route } from "react-router-dom";
import LoginForm from "./LoginForm.js";

export default function Welcome() {
    return (
        <div className="welcome">
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

import RegisterForm from "./RegisterForm";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./login";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to the social network!</h1>
            <img className="logo" src="/logo.jpg" />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <RegisterForm />
                    </Route>
                    <Route path="/login">
                        {}
                        <Login />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}

import RegisterForm from "./RegisterForm";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./login";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to the social network!</h1>
            <img src="/logo.jpg" />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <RegisterForm />
                    </Route>
                    <Route path="/login">
                        {/* <Link to="/login">Click here to Log in!</Link> */}
                        <Login />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}

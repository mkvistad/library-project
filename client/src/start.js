import ReactDOM from "react-dom";
import Welcome from "./Welcome.js";
import App from "./App.js";

fetch("/api/users/me")
    .then((response) => response.json())
    .then((user) => {
        if (!user) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });

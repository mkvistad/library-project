import ReactDOM from "react-dom";
import Welcome from "./Welcome.js";
// import App from "./App.js";

fetch("/api/users")
    .then((response) => response.json())
    .then((user) => {
        if (!user) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <h1>OOOOHHHH YEEEAHHHHH</h1>,
                document.querySelector("main")
            );
        }
    });

// <App />, document.querySelector("main")

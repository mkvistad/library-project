import ReactDOM from "react-dom";
import Welcome from "./Welcome.js";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

fetch("/api/users")
    .then((response) => response.json())
    .then((user) => {
        if (!user) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(<HelloWorld />, document.querySelector("main"));
        }
    });

function HelloWorld() {
    return <div Class="HelloWorld">Burn everything to the ground!</div>;
}

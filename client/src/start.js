import ReactDOM from "react-dom";
import Welcome from "./Welcome.js";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <img src="/logo.gif" alt="logo" />,
                document.querySelector("main")
            );
        }
    });

function HelloWorld() {
    return <div>Hello, World!</div>;
}

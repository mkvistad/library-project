import ReactDOM from "react-dom";
import Welcome from "./Welcome.js";
import App from "./App.js";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

fetch("/api/users/me")
    .then((response) => response.json())
    .then((user) => {
        if (!user) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });

import { Component } from "react";
import { Link } from "react-router-dom";

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();
        const formInput = {
            email: event.target.email.value,
            password: event.target.password.value,
        };
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(formInput),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((user) => {
                if (user.error) {
                    this.setState({ error: "error POSTing login form" });
                    return;
                } else {
                    window.location.href = "/";
                }
            });
    }
    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                    />

                    <button>Log in</button>
                </form>
                <Link to="/">Please Register</Link>
            </div>
        );
    }
}

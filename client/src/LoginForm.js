import { Component } from "react";

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
        fetch("/api/users/me", {
            method: "POST",
            body: JSON.stringify(formInput),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((user) => {
                if (user.error) {
                    this.setState({ error: "Login failure" });
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

                    <button className="button">Log in</button>
                </form>
            </div>
        );
    }
}

import { Component } from "react";
import { Link } from "react-router-dom";

export default class RegisterForm extends Component {
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
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email: event.target.email.value,
            password: event.target.password.value,
        };
        fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(formInput),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ error: "error POSTing registration form" });
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
                        name="first_name"
                        type="first_name"
                        placeholder="First Name"
                        required
                    />
                    <input
                        name="last_name"
                        type="last_name"
                        placeholder="Last Name"
                        required
                    />
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
                    {/* example from Diego on Wednesday...unsure how to implement...{this.error && <p>{this.error}</p>} */}
                    <button>Click Here To Submit Registration</button>
                </form>
                <Link to="/login">
                    Already registered? Click here to log in.
                </Link>
            </div>
        );
    }
}

// inspiration from counter practice
// export default function App() {
//   return (
//     <div className="App">
//       <h1>Counter</h1>

//       <Counter user="Adults" initialNumber={3} />

//       <Counter user="Children" initialNumber={0} />
//     </div>
//   );
// }

// class Counter extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count: props.initialNumber
//     };

//     this.onPlusClick = this.onPlusClick.bind(this);
//     this.onMinusClick = this.onMinusClick.bind(this);
//   }

//   onPlusClick() {
//     this.setState({
//       count: Math.min(this.state.count + 1, 13)
//     });
//   }

//   onMinusClick() {
//     this.setState({
//       count: Math.max(this.state.count - 1, 0)
//     });
//   }

//   render() {
//     return (
//       <div>
//         <h2>{this.props.user} </h2>
//         <button onClick={this.onPlusClick}>Plus</button>
//         <p>{this.state.count} </p>
//         <button onClick={this.onMinusClick}>Minus</button>
//       </div>
//     );
//   }
// }
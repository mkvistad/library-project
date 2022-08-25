import { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import Profile from "./Profile";
import FindPeople from "./FindPeople";
import OtherProfile from "./OtherProfile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.uploadPic = this.uploadPic.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        console.log("component mounted. yay!");
        fetch(`/api/users/me/`)
            .then((result) => result.json())
            .then((data) => {
                console.log("this is the data output", data);
                const { first_name, profile_pic_url, bio } = data;
                this.setState({ first_name, profile_pic_url, bio });
            })
            .catch((error) => {
                console.log("error in mounted: ", error);
            });
    }

    onButtonClick() {
        this.setState({
            showModal: true,
        });
    }

    uploadPic(image) {
        console.log(image);
        this.setState({
            user: { ...this.state.user, profile_pic_url: image },
        });
    }

    closeModal() {
        this.setState({
            showModal: false,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        return (
            <BrowserRouter>
                <section className="appmain">
                    <img className="logo" src="/logo.jpg" />
                    <header>
                        <nav className="home">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/people">Find People</NavLink>
                        </nav>
                    </header>
                    <section className="container">
                        <Route path="/" exact>
                            <Profile
                                first_name={this.state.first_name}
                                onButtonClick={this.onButtonClick}
                                profile_pic_url={this.state.profile_pic_url}
                                showModal={this.state.showModal}
                                uploadPic={this.uploadPic}
                                closeModal={this.closeModal}
                                bio={this.state.bio}
                                setBio={this.setBio}
                            />
                        </Route>
                    </section>

                    <section>
                        <Route path="/users/:user_id">
                            <OtherProfile />
                        </Route>
                        <Route path="/people">
                            <FindPeople />
                        </Route>
                    </section>
                    <footer>Ⓒ Spiced Academy 2022</footer>
                </section>
            </BrowserRouter>
        );
    }
}

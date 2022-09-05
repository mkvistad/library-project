import { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import Profile from "./Profile";
import FindPeople from "./FindPeople";
import OtherProfile from "./OtherProfile";
import Friends from "./Friends";
import Chat from "./Chat";

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
        fetch(`/api/users/me/`)
            .then((result) => result.json())
            .then((data) => {
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
                <header>
                    <img className="logo" src="/logo.jpg" />
                    <nav className="navbar">
                        <NavLink className="navElements" to="/">
                            Home
                        </NavLink>
                        <NavLink className="navElements" to="/people">
                            Find People
                        </NavLink>
                        <NavLink className="navElements" to="/chat">
                            Chat
                        </NavLink>
                    </nav>
                </header>
                <section className="appmain">
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
                        <Route path="/friends">
                            <Friends />
                        </Route>
                        <Route path="/chat">
                            <Chat />
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
                </section>
            </BrowserRouter>
        );
    }
}

import { Component } from "react";
import Profile from "./Profile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.uploadPic = this.uploadPic.bind(this);
    }

    componentDidMount() {
        console.log("component mounted. yay!");
        fetch(`/api/users/me/`)
            .then((result) => result.json())
            .then((data) => {
                console.log("this is the data output", data);
                const { first_name, profile_pic_url } = data;
                this.setState({ first_name, profile_pic_url });
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

    render() {
        return (
            <Profile
                first_name={this.state.first_name}
                onButtonClick={this.onButtonClick}
                profile_pic_url={this.state.profile_pic_url}
                showModal={this.state.showModal}
                uploadPic={this.uploadPic}
                closeModal={this.closeModal}
            />
        );
    }
}

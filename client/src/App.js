import { Component } from "react";
// import ProfilePicture from "./profilepicture.js";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            showModal: false,
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.uploadPic = this.uploadPic.bind(this);
    }
    onButtonClick() {
        this.setState({
            showModal: true,
        });
    }
    uploadPic(profile_pic_url) {
        console.log(profile_pic_url);
    } //then do something...??? Display?

    //Do I need to add close feature?...//
    // closeModal() {
    //     this.setState({
    //         showModal: false,
    //     });
    // }

    //attempting async code....and failing...//
    async mountComponent() {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        this.setState({ user: data });
    }

    render() {
        return (
            <div className="app">
                Hello World
                {/* <p>
                    {" "}
                    Hello! Welcome to the social network,{" "}
                    {this.state.user.first_name}
                </p>
                <ProfilePicture
                    onButtonClick={this.onButtonClick}
                    profile_pic_url={this.state.user.profile_pic_url}
                />
                <p>
                    <button onClick={this.onButtonClick}>Picture Modal</button>
                </p>
                {this.state.showModal && <div>Can you see me?</div>} */}
            </div>
        );
    }
}

// <Modal
//     onUpload={this.onUpload}
//     closeClick={this.closeModal}
// />

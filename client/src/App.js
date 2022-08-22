import { Component } from "react";
// import ProfilePicture from "./profilepicture.js";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            showModal: false,
        };
        // this.onButtonClick = this.onButtonClick.bind(this);
        // this.closeModal = this.closeModal.bind(this);
        // this.uploadPic = this.uploadPic.bind(this);
    }

    componentDidMount() {
        console.log("component mounted. yay!");
        fetch(`/api/users/me/${this.state.id}`)
            .then((data) => console.log("this is the data ====>", data))
            // .then((data) => {
            //     console.log("mounted data: ", data);
            // })
            .catch((error) => {
                console.log("error in mounted: ", error);
            });
    }

    // onButtonClick() {
    //     this.setState({
    //         showModal: true,
    //     });
    // }

    // uploadPic(profile_pic_url) {
    //     console.log(profile_pic_url);
    // } //then do something...??? Display?

    // closeModal() {
    //     this.setState({
    //         showModal: false,
    //     });
    // }

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

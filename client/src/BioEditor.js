import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textArea: false,
            userBioEdit: "",
        };
        this.updateBio = this.updateBio.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    handleInput(event) {
        this.setState({ userBioEdit: event.target.value });
        console.log("event", event.target.value);
    }

    updateBio() {
        console.log("This is working", this.state.userBioEdit);
        fetch("/api/bio", {
            method: "POST",
            body: JSON.stringify({
                bio: this.state.userBioEdit,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((bio) => {
                console.log("data in setBio", bio);
                this.props.setBio(bio);
            })
            .catch((error) => console.log("Unable to update bio", error));

        this.setState({
            textArea: false,
        });
    }

    toggleEdit() {
        this.setState({
            textArea: !this.state.textArea,
        });
    }
    render() {
        console.log("props", this.props);
        return (
            <div>
                {!this.state.textArea && (
                    <div>
                        <button onClick={this.toggleEdit}>Update my bio</button>
                        <p>{this.props.bio}</p>
                    </div>
                )}
                {this.state.textArea && (
                    <form onSubmit={this.updateBio}>
                        <textarea
                            defaultValue={this.props.bio}
                            onInput={this.handleInput}
                        ></textarea>
                        <br />
                        <button>Submit changes</button>
                    </form>
                )}
            </div>
        );
    }
}

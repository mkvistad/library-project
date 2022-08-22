function Modal({ onClose, onUpload }) {
    function onSubmit(event) {
        event.preventDefault();

        fetch("/api/users/profile", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((response) => response.json())
            .then((dataNewImage) => {
                if (dataNewImage.error) {
                    alert("Error POSTing profile pic");
                    return;
                }
                onUpload(dataNewImage.profile_pic_url);
            });
    }
    return (
        <div>
            <div className="Modal">
                <form onSubmit={onSubmit}>
                    <input required type="file" name="file" accept="image/*" />
                    <button>Submit</button>
                </form>
                <p>
                    <button onClick={onClose}>Close</button>
                </p>
            </div>
        </div>
    );
}

export default Modal;

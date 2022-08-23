// import ProfilePicture from "./profilepicture";

function PictureModal({ closeModal, uploadPic }) {
    function onSubmit(event) {
        event.preventDefault();

        fetch("/api/users/profile", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((response) => response.json())
            .then((dataNewImage) => {
                if (dataNewImage.error) {
                    alert("Error: unable to upload");
                    return;
                }
                uploadPic(dataNewImage.profile_pic_url);
                console.log("dataNewImage", dataNewImage);
            });
    }
    return (
        <div>
            <div className="Modal">
                <form onSubmit={onSubmit}>
                    <input name="file" type="file" accept="image/*" required />

                    <button>Upload image</button>
                </form>
                <p>
                    <button onClick={closeModal}>Close</button>
                </p>
            </div>
        </div>
    );
}

export default PictureModal;

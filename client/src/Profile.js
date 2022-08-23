import PictureModal from "./PictureModal";
import ProfilePicture from "./profilepicture.js";

export default function Profile({
    first_name,
    onButtonClick,
    profile_pic_url,
    showModal,
    uploadPic,
    closeModal,
}) {
    return (
        <div className="app">
            Hello World
            <h2>
                Hello! Welcome to the social network, {first_name} {"."}
            </h2>
            <ProfilePicture
                onButtonClick={onButtonClick}
                profile_pic_url={profile_pic_url}
            />
            <button onClick={onButtonClick}>My Picture</button>
            {showModal && (
                <PictureModal uploadPic={uploadPic} closeModal={closeModal} />
            )}
        </div>
    );
}

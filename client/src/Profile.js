import PictureModal from "./PictureModal";
import ProfilePicture from "./profilepicture.js";
import BioEditor from "./BioEditor";
import DeleteAccount from "./DeleteAccount";

export default function Profile({
    first_name,
    onButtonClick,
    profile_pic_url,
    showModal,
    uploadPic,
    closeModal,
    bio,
    setBio,
}) {
    return (
        <div className="app">
            <h4>
                Hello! Welcome to the social network, {first_name} {"."}
            </h4>
            <ProfilePicture
                onButtonClick={onButtonClick}
                profile_pic_url={profile_pic_url}
            />
            <BioEditor bio={bio} setBio={setBio} />
            <button onClick={onButtonClick}>My Picture</button>
            {showModal && (
                <PictureModal uploadPic={uploadPic} closeModal={closeModal} />
            )}
            <DeleteAccount />
        </div>
    );
}

export default function ProfilePicture({ profile_pic_url }) {
    return (
        <img
            className="profile-picture"
            src={profile_pic_url}
            alt="user profile picture"
        />
    );
}

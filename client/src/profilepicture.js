export default function ProfilePicture({ profile_pic_url }) {
    return (
        <img
            className="profile-picture"
            src={profile_pic_url || "/profilepic.jpeg"}
            alt="user profile picture"
        />
    );
}

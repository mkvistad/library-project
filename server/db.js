const secrets = require("./secrets.json");
const { DATABASE_PASSWORD, DATABASE_USER } = secrets;
// const DATABASE_USER = "postgres";
// const DATABASE_PASSWORD = "postgres";

const DATABASE_NAME = "social-network";
const spicedPg = require("spiced-pg");
const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

const bcrypt = require("bcryptjs");
const hash = (password) =>
    bcrypt.genSalt().then((salt) => bcrypt.hash(password, salt));

/// Register User ///
function createUser({ first_name, last_name, email, password }) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                "INSERT INTO users (first_name, last_name, email, password_hash)  VALUES ($1, $2, $3, $4) RETURNING *",
                [first_name, last_name, email, password_hash]
            )
            .then((result) => result.rows[0]);
    });
}
function getUserById(id) {
    return db
        .query(
            `SELECT users.first_name, users.last_name, users.email, users.profile_pic_url, users.bio
            FROM users
            WHERE users.id=$1`,
            [id]
        )
        .then((result) => result.rows[0]);
}
function getUserByEmail(email) {
    return db
        .query(`SELECT * FROM users WHERE email=$1`, [email])
        .then((result) => result.rows[0]);
}

/// Login ///
function login({ email, password }) {
    return getUserByEmail(email).then((user) => {
        if (!user) {
            console.log("incorrect email");
            return null;
        }
        console.log("user email found");
        return bcrypt.compare(password, user.password_hash).then((match) => {
            if (match) {
                console.log("password matches user");
                return user;
            }
            console.log("incorrect password");
            return null;
        });
    });
}

/// Profile Picture ///
function setProfilePic({ user_id, profile_pic_url }) {
    return db
        .query(
            `
UPDATE users
SET profile_pic_url = $2
WHERE users.id = $1
RETURNING *
`,
            [user_id, profile_pic_url]
        )
        .then((result) => result.rows[0]);
}

/// Update Bio ///
function updateBio({ id, bio }) {
    console.log("id", id);
    console.log("bio", bio);
    return db
        .query(
            `UPDATE users
    SET bio = $2
    WHERE id = $1
    RETURNING *`,
            [id, bio]
        )
        .then((result) => result.rows[0]);
}

/// Chat Feature ///
//A 'chatMessage' event handler must be attached to the one socket that just connected. There are two things that must be done in this event handler:

// The new chat message must be stored in the database.

// A 'chatMessage' event must be emitted to all the sockets that are currently connected, including the one that sent the message. The payload for this event should include the new chat message and its id as well as the id, first name, last name, and profile pic of the user who sent it.

// A new database table will be required to store chat messages. It will need columns for the message id, the text of the message, the id of the user who sent it, and a timestamp.

function getMessages(limit = 10) {
    return db
        .query(
            `
        SELECT chat_messages.id, chat_messages.sender_id, chat_messages.message,
        chat_messages.created_at,
        users.first_name, users.last_name, users.profile_pic_url, users.id AS user_id
        FROM chat_messages
        JOIN users ON sender_id = users.id
        ORDER BY chat_messages.created_at DESC
        LIMIT $1
         `,
            [limit]
        )
        .then((result) => result.rows);
}

function storeMessage({ user_id, message }) {
    return db
        .query(
            `
        INSERT INTO chat_messages (sender_id, message)
        VALUES ($1, $2)        
        RETURNING *
         `,
            [user_id, message]
        )
        .then((result) => result.rows[0]);
}

/// Find People ///
function recentUsers(limit) {
    return db
        .query(
            `SELECT * FROM users
        ORDER BY id DESC
        LIMIT $1`,
            [limit]
        )
        .then((result) => result.rows);
}

function searchUsers(find) {
    return db
        .query(
            `SELECT * FROM users
            WHERE first_name ILIKE $1
            OR last_name ILIKE $1
            ORDER BY first_name ASC`,
            [find + "%"]
        )
        .then((result) => result.rows);
}

/// Friendship Requests ///
function getFriendStatus(loggedInId, otherUserId) {
    return db
        .query(
            `SELECT * FROM friendships
  WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1)`,
            [loggedInId, otherUserId]
        )
        .then((result) => {
            // if (result.row.length < 1) {
            //     return null;
            // }
            console.log("result in db.js", result);
            return result.rows[0];
        });
}

function makeFriendRequest(loggedInId, otherUserId) {
    return db
        .query(
            `INSERT INTO friendships
        (recipient_id, sender_id)
        VALUES ($1, $2)
        RETURNING *`,
            [loggedInId, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function acceptFriendRequest(loggedInId, otherUserId) {
    return db
        .query(
            `UPDATE friendships
        SET accepted = true
        WHERE (recipient_id=$1 AND sender_id=$2)
        OR (sender_id=$2 AND recipient_id=$1)`,
            [loggedInId, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function cancelFriendRequest(loggedInId, otherUserId) {
    return db
        .query(
            `DELETE FROM friendships
        WHERE (recipient_id=$1 AND sender_id=$2)
        OR (sender_id=$2 AND recipient_id=$1)`,
            [loggedInId, otherUserId]
        )
        .then((result) => result.rows[0]);
}

/// View Friendship Status ///
function viewFriendships(user_id) {
    return db
        .query(
            `SELECT friendships.accepted, friendships.sender_id, friendships.recipient_id,
             users.first_name, users.last_name, users.profile_pic_url, users.id
             FROM friendships
             JOIN users
             ON (users.id = friendships.sender_id AND friendships.recipient_id = $1)
             OR (users.id = friendships.recipient_id AND friendships.sender_id = $1 AND friendships.accepted=true)`,
            [user_id]
        )
        .then((result) => result.rows);
}

/// Delete Account **Additional Feature** ///
//Account Deletion - Users should be allowed to delete all of the information your social network has about them. This includes:

// Their rows in the users table
function deleteAccount(user_id) {
    return db
        .query(
            `
         DELETE FROM users
         WHERE id = $1
     `,
            [user_id]
        )
        .then((result) => result.rows[0]);
}

// All rows that have the user's id in the friendships table
function deleteFriends(user_id) {
    return db
        .query(
            `
         DELETE FROM friendships
         WHERE sender_id = $1 OR recipient_id = $1
     `,
            [user_id]
        )
        .then((result) => result.rows[0]);
}

// All rows that have the user's id in the chat_messages table
function deleteMessages(user_id) {
    return db
        .query(
            `
         DELETE FROM chat_messages
         WHERE sender_id = $1
     `,
            [user_id]
        )
        .then((result) => result.rows[0]);
}
// Every profile picture they have ever uploaded. This will require a change to how you store the urls of profile pics so that you have a record of every single one for every single user. It will also require you to use the deleteObject method from the AWS SDK.
//Not needed since all profile pics are set to one default

/*🚨  dont forget to export the function(s) so that it they are accessible in our server.js! */
module.exports = {
    createUser,
    getUserById,
    login,
    setProfilePic,
    updateBio,
    getMessages,
    storeMessage,
    recentUsers,
    searchUsers,
    getFriendStatus,
    makeFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    viewFriendships,
    deleteAccount,
    deleteMessages,
    deleteFriends,
};

// psql -d social-network -f setup.sql

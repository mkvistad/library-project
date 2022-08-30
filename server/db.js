const secrets = require("./secrets.json");
const { DATABASE_PASSWORD, DATABASE_USER } = secrets;
console.log(DATABASE_PASSWORD);
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

/*🚨  dont forget to export the function(s) so that it they are accessible in our server.js! */
module.exports = {
    createUser,
    getUserById,
    login,
    setProfilePic,
    updateBio,
    recentUsers,
    searchUsers,
    getFriendStatus,
    makeFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    viewFriendships,
};

// psql -d social-network -f setup.sql

//
//
//
//
//
//
//
//
//
//
//
//

/// Reset Password ///
// const cryptoRandomString = require("crypto-random-string");
// const secretCode = cryptoRandomString({
//     length: 6,
// });

// function resetCode(email, secretCode) {
//     return getUserByEmail(email).then((foundUser) => {
//         if (!foundUser) {
//             console.log("email not found!");
//             return null;
//         }
//         return
// .then((email, code, created_at) => {
//             return db
//                 .query(
//                     `INSERT INTO reset_codes (email, code, created_at) VALUES ($1, $2, $3) RETURNING *`,
//                     [email, code, created_at]
//                 )
//                 .then((result) => result.rows[0]);
//         });
//     });
// }

// function verifyCode() {
//     return db.query(`SELECT * FROM reset_codes
// WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';`);
// }

// function changePassword() {
//     return hash(password).then((password_hash) => {
//         return db
//             .query(
//                 `INSERT INTO users (password_hash) VALUES ($1) RETURNING *`,
//                 [password_hash]
//             )
//             .then((result) => result.rows[0]);
//     });
// }

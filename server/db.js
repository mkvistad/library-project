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
        .query(`SELECT * FROM users WHERE id=$1`, [id])
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
        console.log("user email not found");
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
async function setProfilePic({ user_id, profile_pic_url }) {
    const result = await db
        .query(
            `
UPDATE users 
SET password_hash = $1
RETURNING *
`,
            [password_hash]
        )
        .then((result) => result.rows[0]);
}

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

/*🚨  dont forget to export the function(s) so that it they are accessible in our server.js! */
module.exports = {
    createUser,
    getUserById,
    login,
    setProfilePic,
    // resetCode,
    // verifyCode,
    // changePassword,
    // createSignature,
    // getSignatureByUserId,
    // createUserProfile,
    // getSigners,
};

// psql -d social-network -f setup.sql

/////////////////////////////////////////////////
///from petition code ///
// function createSignature({ user_id, signature }) {
//     return db
//         .query(
//             `INSERT INTO signatures (user_id, signature)
//     VALUES ($1, $2)
//     RETURNING *`,
//             [user_id, signature]
//         )
//         .then((result) => result.rows[0])
//         .catch((error) => error);
// }

// function getUserByEmail(email) {
//     //get data from user  in another fn compare return email and pw hash in db and correct
//     return db
//         .query(`SELECT * FROM users WHERE email=$1`, [email])
//         .then((result) => result.rows[0]);
// }
// function login({ email, password }) {
//     return getUserByEmail(email).then((foundUser) => {
//         if (!foundUser) {
//             console.log("incorrect email");
//             return null;
//         }
//         console.log("email matches user");
//         return bcrypt
//             .compare(password, foundUser.password_hash)
//             .then((match) => {
//                 if (match) {
//                     console.log("password matches user");
//                     return foundUser;
//                 }
//                 console.log("incorrect password");
//                 return null;
//             });
//     });
// }
// function createUserProfile({ user_id, age, city, homepage }) {
//     return db
//         .query(
//             `INSERT INTO user_profiles(user_id, age, city, homepage) VALUES ($1, $2, $3, $4) RETURNING *`,
//             [user_id, age, city, homepage]
//         )
//         .then((result) => result.rows[0]);
// }

// function getSigners() {
//     return db
//         .query(
//             `
//         SELECT * FROM users
//         JOIN signatures ON signatures.user_id = users.id
//         FULL JOIN user_profiles ON user_profiles.user_id = users.id
//         WHERE signatures.signature IS NOT NULL
//     `
//         )
//         .then((result) => result.rows);
// }

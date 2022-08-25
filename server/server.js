const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { Bucket, s3Upload } = require("./s3");
const { uploader } = require("./uploader");

const cookieSession = require("cookie-session");
const { secret } = require("./secrets.json");
console.log(secret);

//🚨 remember to connect //
const {
    createUser,
    getUserById,
    login,
    setProfilePic,
    updateBio,
    recentUsers,
    searchUsers,
    getFriendStatus,
    makeFriendRequest,
} = require("./db");

// ******* End variable list ******* //
// ------------------------------------------------- //
// *********  Start middleware setup *********** //

app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    cookieSession({
        secret: secret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

// *********  End middleware setup *********** //
// ------------------------------------------------- //
// *********  Start functions *********** //

/// Register User ///
app.get("/api/users/me", (request, response) => {
    // console.log("is this working?", request.session.user_id);
    if (!request.session.user_id) {
        response.json(null);
        return;
    }
    getUserById(request.session.user_id)
        .then((userInfo) => response.json(userInfo))
        .catch((error) => console.log("error", error));
});

app.post("/api/users", (request, response) => {
    console.log("post user", request.body);
    createUser(request.body)
        .then((newUser) => {
            console.log("newUser setup working", newUser);
            request.session.user_id = newUser.id;
            response.json(newUser);
        })
        .catch((error) => {
            if (error.constraint === "email") {
                response.status(400).json({ error: "email not available" });
                return;
            }
            response.status(500).json({ error: "POST api/users catch error" });
        });
});

/// Login ///
app.post("/api/login", (request, response) => {
    console.log("POST /api/login", request.body);
    login(request.body)
        .then((user) => {
            if (!user) {
                response.json({ error: "wrong login" });
                return;
            }
            request.session.user_id = user.id;
            response.json(user);
        })
        .catch((error) => {
            console.log("POST /api/login", error);
            response.status(500).json({ error: "api/login catch error" });
        });
    console.log("login", login);
});

/// Logout ///
app.post("/logout", (request, response) => {
    request.session = null;
    response.json({ message: "successful logout" });
});

/// Logged in ///

// app.get(`/api/user/me/:id`, (request, response) => {
//     const userId = request.session.user_id;
//     const { id } = request.params;

//     getUserById(id === "undefined" ? userId : id)
//         .then((data) => {
//             if (userId === id) {
//                 return response.json({ ownId: true });
//             }
//             return response.json(data);
//         })
//         .catch((error) => {
//             console.log("error sending user to client: ", error);
//             return response.json({ noId: true });
//         });
// });

/// Profile Picture ///
app.post(
    "/api/users/profile",
    uploader.single("file"),
    s3Upload,
    (request, response) => {
        const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;
        console.log("POST /upload", url);
        console.log("POST /upload", url);

        setProfilePic({
            user_id: request.session.user_id,
            profile_pic_url: url,
        })
            .then((user) => {
                response.json(user);
            })
            .catch((error) => {
                console.log("POST upload pic catch", error);
                response.status(500).json({ message: "unable to upload pic" });
            });
    }
);

/// Update Bio ///
app.post("/api/bio", (request, response) => {
    console.log("POST /api/bio", request.body);
    const userID = request.session.user_id;
    updateBio({ id: userID, bio: request.body.bio })
        .then((user) => {
            console.log("user in bio", user);
            response.json(user.bio);
        })
        .catch((error) => {
            console.log("error POSTing updateBio", error);
            response.statusCode(500).json({ message: "unable to update bio" });
        });
});

/// Find People ///
app.get("/api/users/recent", async (request, response) => {
    const limit = 3;
    const searchResults = await recentUsers(limit);
    response.json(searchResults);
});

app.get("/api/users/search", async (request, response) => {
    console.log("log from server.js, GET /api/users/search", request.query);
    const searchResults = await searchUsers(request.query.q);
    response.json(searchResults);
});

app.get("/api/users/:user_id", (request, response) => {
    getUserById(request.params.user_id).then((result) => {
        response.json(result);
    });
});

/// Friendship Requests ///
app.get("/api/friendship-status/:otherUserId", (request, response) => {
    console.log("request.params.otherUserId: ", request.params.otheruserid);
    const otherUserId = request.params.otherUserId;
    const loggedInId = request.session.user_id;
    console.log("otherUserId", otherUserId);
    console.log("loggedInId", loggedInId);
    getFriendStatus(loggedInId, otherUserId)
        .then((result) => {
            console.log("result", result);
            if (!result) {
                return response.json("Accept Friend Request");
            } else if (result.accepted === true) {
                return response.json("End Friendship");
            } else if (result.accepted === false) {
                return response.json("Cancel Friend Request");
            } else if (!result.accepted) {
                return response.json("Make Friend Request");
            }
        })
        .catch((error) => console.log("error", error));
});

app.post("/api/make-request/:otherUserId", (request, response) => {
    const otherUserId = request.params.otherUserId;
    const loggedInId = request.session.user_id;
    console.log("otherUserId", otherUserId);
    console.log("loggedInId", loggedInId);
    makeFriendRequest(loggedInId, otherUserId).then((results) => {
        console.log("results POSTing make request", results);
        response.json(results);
    });
});

// app.post("/api/accept-request/:otherUserId", (request, response) => {
//     console.log("something here");
//     const otherUserId = request.params.otherUserId;
//     const loggedInId = request.session.user_id;
// });
// app.post("/api/cancel-request/:otherUserId", (request, response) => {
//     console.log("something here");
//     const otherUserId = request.params.otherUserId;
//     const loggedInId = request.session.user_id;
// });
// app.post("/api/unfriend/:otherUserId", (request, response) => {
//     console.log("something here");
//     const otherUserId = request.params.otherUserId;
//     const loggedInId = request.session.user_id;
// });

//(NB: you might want to combine the cancel-request and unfriend routes) - this may lead to more logic happening client side.

//*********  Always in end position *********//
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

//npm run dev:client
//npm run dev:server
//psql -d social-network

//
//
//
///
//
///
//
//
//

/// NEED HELP To set up the reset password funciton///
/// Reset Password 2 step process///
// app.post("/password/reset/stepone", (request, response) => {
//     resetCode(request.body)
//         .then((foundUser) => {
//             if (!foundUser) {
//                 response
//                     .status(401)
//                     .json({ error: "reset request email not found" });
//                 return;
//             }
//         })
//         .catch((error) => {
//             console.log("POST resetCode error", error);
//             response
//                 .status(500)
//                 .json({ error: "failure in passoword reset request" });
//         });
// });

// app.post("/password/reset/steptwo", (request, response) => {
//     verifyCode();
//     changePassword();
//     getUserByEmail();
// });

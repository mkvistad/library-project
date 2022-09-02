const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");

const { Bucket, s3Upload } = require("./s3");
const { Server } = require("http");

const socketConnect = require("socket.io");
const server = Server(app);

const { secret } = require("./secrets.json");
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: secret,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

const diskStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (request, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//🚨 remember to connect //
const {
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
} = require("./db");

// ******* End variable list ******* //
//--------------------------------------------//

app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieSessionMiddleware);

// *********  End middleware setup *********** //
//------------------------------------------ //
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

/// Profile Picture ///
app.post(
    "/api/users/profile",
    uploader.single("file"),
    s3Upload,
    (request, response) => {
        const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;
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

/// Chat Feature ///
const io = socketConnect(server, {
    allowRequest: (request, callback) =>
        callback(
            null,
            request.headers.referer.startsWith(`http://localhost:3000`)
        ),
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", async (socket) => {
    console.log("[social:socket] incoming socked connection", socket.id);
    const { user_id } = socket.request.session;
    console.log("SOCKETSESSION", socket.request.session);
    if (!user_id) {
        return socket.disconnect(true);
    }
    const recentMessages = await getMessages();
    console.log("remember to code Messages", recentMessages);
    socket.emit("recentMessages", recentMessages.reverse());

    socket.on("New Message", async (text) => {
        console.log("socket ON user_id", user_id);
        const newMessage = await storeMessage({
            user_id: user_id,
            message: text,
        });
        console.log("remember to store Messages", storeMessage);
        console.log("New Message", newMessage);

        const sender = await getUserById(newMessage.sender_id);

        io.emit("broadcastMessages", {
            ...newMessage,
            ...sender,
            message_id: newMessage.id,
        });
    });
});

/// Find People ///
app.get("/api/users/recent", async (request, response) => {
    const limit = 3;
    const searchResults = await recentUsers(limit);
    response.json(searchResults);
});

app.get("/api/users/search", async (request, response) => {
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
    console.log("request.params.otherUserId: ", request.params.otherUserId);
    const otherUserId = request.params.otherUserId;
    const loggedInId = request.session.user_id;
    getFriendStatus(loggedInId, otherUserId)
        .then((result) => {
            console.log("result", result);
            if (!result) {
                response.json("Make Friend Request");
            } else if (!result.accepted && otherUserId == result.recipient_id) {
                response.json("Accept Friend Request");
            } else if (!result.accepted) {
                response.json("Cancel Friend Request");
            } else if (result.accepted) {
                response.json("End Friendship");
            }
        })
        .catch((error) => console.log("error", error));
});

app.post("/api/make-request/:otherUserId", (request, response) => {
    const otherUserId = request.params.otherUserId;
    const loggedInId = request.session.user_id;
    makeFriendRequest(loggedInId, otherUserId).then((results) => {
        response.json(results);
    });
});

app.post("/api/accept-request/:otherUserId", (request, response) => {
    const otherUserId = request.params.otherUserId;
    const loggedInId = request.session.user_id;
    acceptFriendRequest(loggedInId, otherUserId).then((results) => {
        response.json(results);
    });
});

app.post("/api/cancel-request/:otherUserId", (request, response) => {
    const otherUserId = request.params.otherUserId;
    const loggedInId = request.session.user_id;
    cancelFriendRequest(loggedInId, otherUserId).then((results) => {
        response.json(results);
    });
});

/// View Friendship Status ///
app.get("/api/friendships", (request, response) => {
    viewFriendships(request.session.user_id).then((result) => {
        response.json(result);
    });
});

//*********  Always in end position *********//
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// app.listen(process.env.PORT || 3001, function () {
//     console.log("I'm listening.");
// });

server.listen(process.env.PORT || 3001, () =>
    console.log("Socket says --> I'm Listening")
);

//npm run dev:client
//npm run dev:server
//psql -d social-network

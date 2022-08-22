const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
// const spicedPg = require("spiced-pg");

const cookieSession = require("cookie-session");
const { secret } = require("./secrets.json");
console.log(secret);

//🚨 remember to connect //
const {
    createUser,
    getUserById,
    login,
    getProfilePic,
    // resetCode,
    // verifyCode,
    // changePassword,
    // createSignature,
    // getSignatureByUserId,
    // createUserProfile,
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
    if (!request.session.user_id) {
        response.json(null);
        return;
    }

    getUserById()
        .then(request.session.user_id)
        .then((user) => {
            response.json(user);
        });
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

/// Profile Picture ///
app.post(
    "api/users/profile",
    uploader.single("file"),
    s3upload,
    (request, response) => {
        const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;
        console.log("POST /upload", url);

        updateProfilePic({
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

/// NEED HELP ///
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

// app.get("/", (request, response) => {
//     console.log("no user id", request.session.user_id);
//     if (!request.session.user_id) {
//         response.redirect("/register");
//         return;
//     }
//     response.render("homepage");
// });

// app.post("/", (request, response) => {
//     if (!request.session.user_id) {
//         response.redirect("/register");
//         return;
//     }
//     const { signature } = request.body;
//     console.log("SIGNATURE*****", signature);
//     console.log("POST /", request.body);
//     createSignature({ user_id: request.session.user_id, signature }).then(
//         (result) => {
//             request.session.signature_id = result.id;

//             console.log("result", result);
//             response.redirect("/thank-you");
//         }
//     );
// });

// app.get("/register", (request, response) => {
//     response.render("register");
// });

// app.post("/register", (request, response) => {
//     console.log("POST /", request.body);

//     const { first_name, last_name, email, password } = request.body;

//     createUser(first_name, last_name, email, password)
//         .then((result) => {
//             console.log("result", result);
//             request.session.user_id = result.id;
//             console.log(request.session.user_id);
//             response.redirect("/profile");
//         })
//         .catch((error) => {
//             console.log("error creating user profile", error.constraint);
//             if (error.constraint === "users_email_key") {
//                 response.status(400).render("register", {
//                     error: "email taken",
//                 });
//                 return;
//             }
//             response.status(500).render("register", {
//                 error: "error registering profile",
//             });
//         });
// });

// app.get("/login", (request, response) => {
//     if (request.session.user_id) {
//         response.redirect("/");
//         return;
//     }
//     response.render("login");
// });

// app.post("/login", (request, response) => {
//     console.log("POST /login", request.body);
//     login(request.body)
//         .then((foundUser) => {
//             if (!foundUser) {
//                 response.render("login", { error: "wrong login" });
//                 return;
//             }
//             request.session.user_id = foundUser.id;
//             response.redirect("/");
//         })
//         .catch((error) => {
//             console.log("error logging in", error);
//             response.status(500).render("register", {
//                 error: "error",
//             });
//         });
//     // console.log(getUserByEmail);
// });

// app.get("/profile", (request, response) => {
//     if (!request.session.user_id) {
//         response.redirect("/login");
//         return;
//     }
//     response.render("profile");
// });

// app.post("/profile", (request, response) => {
//     if (!request.session.user_id) {
//         response.redirect("/login");
//         return;
//     }
//     request.body.user_id = request.session.user_id;
//     createUserProfile(request.body)
//         .then(response.redirect("/"))
//         .catch((error) => {
//             console.log(error);
//             response.render("profile", {
//                 errorMessage: "Information is incorrect",
//             });
//         });
// });

// app.get("/thank-you", (request, response) => {
//     if (!request.session.user_id) {
//         response.redirect("/register");
//         return;
//     }
//     const user_id = request.session.user_id;
//     getSignatureByUserId(user_id).then((signature) => {
//         response.render("thank-you", { signature });
//     });
//     return;
// });

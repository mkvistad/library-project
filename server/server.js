const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

const cookieSession = require("cookie-session");
const { secret } = require("./secrets.json");
console.log(secret);

//🚨 remember to connect //
const {
    // createSignature,
    createUser,
    // getSignatureByUserId,
    // login,
    // createUserProfile,
    getUserById,
} = require("./db");

// ******* End variable list ******* //
// ------------------------------------------------- //
// *********  Start setup *********** //

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

// *********  End  setup *********** //
// ------------------------------------------------- //
// *********  Start middleware functions *********** //

// Prompt from notes:
// app.get("/user/id.json", function (req, res) {
//     res.json({
//         userId: req.session.userId,
//     });
// });
app.get("/api/users", (request, response) => {
    if (!request.session.user_id) {
        response.json(null);
        return;
    }
    // getSigners() used from petition
    getUserById()
        .then(request.session.user_id)
        .then((user) => {
            response.json(user);
        });
});
app.post("/api/users", (request, response) => {
    console.log("post user", request.body);
    createUser(request.body).then((newUser) => {
        console.log("newUser setup working", newUser);
        request.session.user_id = newUser.id;
        response.json(newUser);
    });
});

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

const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

const nodeISBN = require("node-isbn");
const bookIsbn = require("./isbn.json");
const userInfo = require("./user.json");
const {
    getBooks,
    searchBooks,
    getBookById,
    getBookByTitle,
    searchAuthor,
    getBooksByAuthor,
} = require("./db");

const { secret } = require("./secrets.json");
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: secret,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieSessionMiddleware);

async function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        nodeISBN.resolve(isbn, (error, book) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(book);
        });
    });
}

app.get("/api/books/test", async (request, response) => {
    const allBooks = await getBooks();

    response.json(allBooks);
});

app.get("/api/books", async (request, response) => {
    const books = await getBooks();
    response.json(books);
});

app.get("/api/users/me", (request, response) => {
    const userId = request.session.userId;
    if (!userId) {
        response.json(null);
        return;
    }
    response.status(200).json("homepage");
});

app.post("/api/users/me", (request, response) => {
    const { email, password } = request.body;
    console.log("email, pass", email, password);
    if (email === userInfo.email && password === userInfo.password) {
        request.session.userId = 1;
        response.json({ success: true });
    } else {
        response.status(404).json(null);
    }
});

app.get("/api/books/search", async (request, response) => {
    const searchResults = await searchBooks(request.query.q);
    response.json(searchResults);
});

app.get("/api/books/author/search", async (request, response) => {
    const searchResults = await searchAuthor(request.query.q);
    response.json(searchResults);
});

app.get("/api/books/:book_id", (request, response) => {
    getBookById(request.params.book_id).then((result) => {
        response.json(result);
    });
});

app.get("/api/authors/:book_authors", (request, response) => {
    getBooksByAuthor(request.params.book_authors).then((result) => {
        response.json(result);
    });
});

app.get("/api/title/search", async (request, response) => {
    const titlesResult = await getBookByTitle(request.query.q);
    response.json(titlesResult);
});

//*********  Always in end position *********//
app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, () =>
    console.log("Socket says --> I'm Listening")
);

//npm run dev:client
//npm run dev:server
//psql library

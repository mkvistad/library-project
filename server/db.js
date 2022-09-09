const secrets = require("./secrets.json");
const { DATABASE_PASSWORD, DATABASE_USER } = secrets;

const DATABASE_NAME = "library";
const spicedPg = require("spiced-pg");
const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

function getBooks() {
    return db
        .query("SELECT * FROM books ORDER BY id ASC")
        .then((result) => result.rows);
}

function createBook({
    title,
    authors,
    publishedDate,
    pageCount,
    categories,
    maturityRating,
    imageLinks,
    language,
    description,
    infoLink,
}) {
    return db
        .query(
            `INSERT INTO books ( title,
    authors,
    publishedDate,
    pageCount,
    categories,
    maturityRating,
    imageLinks,
    language,
    description,
    infoLink) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                title,
                authors,
                publishedDate,
                pageCount,
                categories,
                maturityRating,
                imageLinks,
                language,
                description,
                infoLink,
            ]
        )
        .then((result) => result.rows[0]);
}

module.exports = {
    createBook,
    getBooks,
};

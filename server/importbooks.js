const nodeISBN = require("node-isbn");
const bookIsbn = require("../isbn.json");

//import
const { createBook } = require("./db");

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

(async () => {
    await Promise.all(
        bookIsbn.map(async (isbn) => {
            const data = await getBookByISBN(isbn);
            const author = Array.isArray(data.authors)
                ? data.authors.join(", ")
                : data.authors;
            const book = await createBook({
                title: data.title,
                authors: author,
                publishedDate: data.publishedDate,
                description: data.description,
                pageCount: data.pageCount,
                categories: data.categories ? data.categories.join(", ") : "",
                maturityRating: data.maturityRating,
                imageLinks: data.imageLinks && data.imageLinks.thumbnail,
                language: data.language,
                infoLink: data.infoLink,
            });
        })
    );
    console.log("Done!");
})();

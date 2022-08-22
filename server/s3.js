const fs = require("fs");

const Bucket = "spicedling";

const { AWS_KEY, AWS_SECRET } = require("./secrets.json");
const { S3 } = require("aws-sdk"); /* connect all the dots to secrets and S3 */

const s3 = new S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

function s3Upload(request, response, next) {
    if (!request.file) {
        console.log("[imageboard:s3] file not there");
        response.sendStatus(500);
        return;
    }

    const {
        filename: Key,
        mimetype: ContentType,
        size: ContentLength,
        path,
    } = request.file;

    console.log("[imageboard:s3] uploading to s3...", {
        Bucket,
        Key,
        ContentType,
        ContentLength,
    });

    s3.putObject({
        Bucket,
        ACL: "public-read",
        Key: request.file.filename,
        Body: fs.createReadStream(path),
        ContentType: request.file.mimetype,
        ContentLength: request.file.size,
    })
        .promise()
        .then(() => {
            next();
            // delete original file on upload
            // fs.unlink(path, () => {});
        })
        .catch((error) => {
            console.log("[imageboard:s3] error uploading to s3", error);
            response.sendStatus(500);
        });
}

module.exports = { Bucket, s3Upload };

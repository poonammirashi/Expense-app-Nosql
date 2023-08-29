const aws = require("aws-sdk");

exports.uploadFile = async function uploadFile(data, file) {
    try {
        const s3bucket = new aws.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY
        });

        var params = {
            Bucket: "expensetrackerappbypoonam",
            Key: file,
            Body: data,
            ACL: 'public-read'
        }
        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.Location);
                }
            })
        })

    } catch (err) {
        console.log(err);

    }
}
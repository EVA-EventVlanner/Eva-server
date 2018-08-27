'use strict'
const storage = require("@google-cloud/storage");
const fs = require('fs')

const gcs = storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.KEYFILE_PATH
})

const bucketName = process.env.CLOUD_BUCKET
const bucket = gcs.bucket(bucketName)

function getPublicUrl(filename) {
    return `https://storage.googleapis.com/`+ bucketName + `/${filename}`
}

let ImgUpload = {}

ImgUpload.uploadGCS = (req, res, next) => {
    if (!req.file) return next()

    // optional to add path directly
    const gcsname = req.file.originalname
    const file = bucket.file(gcsname)

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    })

    stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
    })

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname
        file.makePublic().then(() => {
            req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
            next()
        })
    })

    stream.end(req.file.buffer)
}

module.exports = ImgUpload
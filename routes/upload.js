const express = require('express')
const router = express.Router()
const Multer = require('multer')
const Upload = require('../controllers/upload-controller')

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

router.post('/upload', multer.single('image'), Upload.uploadGCS, function(request, response, next) {
    const data = request.body
    if (request.file && request.file.cloudStoragePublicUrl) {
        data.imageUrl = request.file.cloudStoragePublicUrl
    }
    
    response.send(data)
})

module.exports = router
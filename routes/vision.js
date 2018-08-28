const express = require('express')
const router = express.Router()
const Vision = require('../controllers/vision-controller')
const Upload = require('../controllers/upload-controller')
const Multer = require('multer')

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

router.post('/uploadAnalyze', multer.single('image'), Upload.uploadGCS, Vision.analyze)

router.post('/analyzelink', Vision.analyzeWithLink)

module.exports = router
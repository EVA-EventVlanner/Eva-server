const express = require('express')
const router = express.Router()
const Vision = require('../controllers/vision-controller')

router.post('/analyze', Vision.Controller.analyze)

router.post('/upload',
                Vision.multer.single('file'),
                Vision.Controller.uploadToStorage,
                Vision.Controller.analyze )

module.exports = router
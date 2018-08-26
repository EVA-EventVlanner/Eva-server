const express = require('express')
const router = express.Router()
const Vision = require('../controllers/vision-controller')

router.post('/analyze', Vision.Controller.analyze)

// router.post('/upload', Vision.multer.single('file'), Vision.Controller.uploadToStorage, function (req, res) {
//     res
//         .status(200)
//         .send ({
//             message: 'Upload successfull',
//             link: req.file.cloudStoragePublicUrl
//         })
// })

router.get('/test', function (req, res, next) {
    res.status(200).send('test-ok')
})

router.post('/upload',
                Vision.multer.single('file'),
                Vision.Controller.uploadToStorage,
                Vision.Controller.analyze )

module.exports = router
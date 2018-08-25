const express = require('express')
const router = express.Router()
const Vision = require('../controllers/vision-controller')

router.post('/analyze', Vision.analyze)

// router.get('/text', function(req, res) {
//     var img = req.body.image_url

//     Vision.analyze(img, function(result) {
//         res.json(result)
//     })
// })

module.exports = router
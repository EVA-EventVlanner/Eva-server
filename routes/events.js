const express = require('express');
const router = express.Router();
const Controller = require('../controllers/event-controller')
/* GET users listing. */
router.get('/', Controller.getAllEvent)
router.post('/', Controller.createEvent)
module.exports = router;

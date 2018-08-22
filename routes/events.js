const express = require('express');
const router = express.Router();
const Controller = require('../controllers/event-controller')
/* GET users listing. */
router.get('/', Controller.getAllEvent)
router.get('/:id', Controller.getEventById)
router.post('/', Controller.createEvent)
router.delete('/delete/:id', Controller.deleteEvent)

module.exports = router;

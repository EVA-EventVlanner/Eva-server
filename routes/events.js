const express = require('express');
const router = express.Router();
const Controller = require('../controllers/event-controller')
/* GET users listing. */
router.get('/', Controller.getAllEvent)
router.get('/:eventId', Controller.getEventById)
router.get('/:eventId/item/:itemId', Controller.getOneItem)

router.post('/', Controller.createEvent)
router.post('/:eventId/item', Controller.createItemForEvent)


router.delete('/delete/eventId', Controller.deleteEvent)
router.delete('/:eventId/item/:itemId/delete', Controller.deleteItemFromEvent)

module.exports = router;

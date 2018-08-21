const express = require('express');
const router = express.Router();
const Controller = require('../controllers/user-controller')
/* GET users listing. */
router.get('/', Controller.getUsers )
router.post('/register', Controller.register )
router.post('/login', Controller.login )

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/login', userController.showLogin);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/register', userController.showRegister);
router.post('/register', userController.register);

router.get('/index', userController.showIndex);

module.exports = router;
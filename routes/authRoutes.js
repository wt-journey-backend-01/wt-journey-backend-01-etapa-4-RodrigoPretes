const express = require('express');
const { register, login, refresh, deleteUserById, userLogged } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.delete('/users/:id', authMiddleware, deleteUserById);
router.get('/usuarios/me', authMiddleware, userLogged);

module.exports = router;
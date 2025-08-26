const express = require('express');
const { register, login, deleteUserById, userLogged } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.delete('/users/:id', authMiddleware,deleteUserById);
router.get('/usuarios/me', authMiddleware, userLogged);

module.exports = router;
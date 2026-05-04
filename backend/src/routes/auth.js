const router = require('express').Router();
const { register, login, me, registerValidation, loginValidation } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, me);

module.exports = router;

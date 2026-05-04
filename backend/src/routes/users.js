const router = require('express').Router();
const { getProfile, updateProfile, changePassword, getMyListings } = require('../controllers/usersController');
const { authenticate } = require('../middleware/auth');

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.get('/my-listings', authenticate, getMyListings);

module.exports = router;

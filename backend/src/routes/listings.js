const router = require('express').Router();
const {
  getListings, getListingById, createListing, updateListing,
  deleteListing, saveListing, unsaveListing, getSavedListings,
} = require('../controllers/listingsController');
const { authenticate } = require('../middleware/auth');

router.get('/', getListings);
router.get('/saved', authenticate, getSavedListings);
router.get('/:id', getListingById);
router.post('/', authenticate, createListing);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);
router.post('/:id/save', authenticate, saveListing);
router.delete('/:id/save', authenticate, unsaveListing);

module.exports = router;

const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces'); // We need our controllers to indicate the actions of each route
const auth = require('../middleware/auth'); // We need the auth middleware for authentifying every route
const multer = require('../middleware/multer-config'); // Aswell as multer for adding an image the post and put routes

router.post('/', auth, multer, saucesCtrl.createSauce); // Sauce creation route, need multer for the images
router.put('/:id', auth, multer, saucesCtrl.modifySauce); // Route where you can modify your sauce, multer loaded if you need to replace the image
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Route where you can delete your sauce
router.get('/:id', auth, saucesCtrl.getOneSauce); // Route loaded after clicking on a specific sauce
router.get('/', auth, saucesCtrl.getAllSauces); // Main route where all the sauces are loaded
router.post('/:id/like', auth, saucesCtrl.reactToSauce); // Route where you can like or dislike any of the existing sauces

module.exports = router; // We export the routes so that they can be called in our app.js
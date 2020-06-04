const multer = require('multer'); // We need multer to allow users to upload images

const MIME_TYPES = { // We first need to make sure that only certain formats are allowed, since we only want images
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype]; // If the MIME_TYPE doesn't match, the user will receive an error
    callback(null, name + Date.now() + '.' + extension); // We name the image using Date.now to ensure a unique name
  }
});

module.exports = multer({storage: storage}).single('image'); // We then export this image upload function to use it in our routes
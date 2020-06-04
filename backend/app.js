const express = require('express');
const bodyParser = require('body-parser'); // We need bodyParser to extract the information from HTTP requests and render it usable
const mongoose = require('mongoose'); // We'll need the mongoose plugin to connect to the DB
const path = require('path'); // We'll use the path plugin to upload our images
const cors = require('cors'); // This module will help us to enable CORS
const helmet = require('helmet'); // Helmet is a very well rounded security plugin, used for many different reasons
/* Among other things, it secures our HTTP requests, secures the Headers, controls browser DNS prefetching, prevents clickjacking,
adds minor XSS protection and protects against MIME TYPE sniffing */

const saucesRoutes = require('./routes/sauces'); // We're going to need both our sauces and user routes
const userRoutes = require('./routes/user');

require('dotenv').config(); // we will use this to hide the database connection informations

mongoose.connect('mongodb+srv://'+process.env.LOGIN+':'+process.env.PASSWORD+"@"+process.env.URL,
// Sensitive informations replace by "process.env.[]"
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet()); // Execution of the helmet security plugin

app.use((req, res, next) => { // We declare all the headers to allow :
    res.setHeader('Access-Control-Allow-Origin', '*'); // Connection from any origin
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Access to any of these routes
    next();
});

app.use(cors()); // Execution of the CORS module

app.use(bodyParser.json()); // This will parse application/json type POST data

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes); // We specify the routes used for both our sauces and users
app.use('/api/auth', userRoutes);

module.exports = app;
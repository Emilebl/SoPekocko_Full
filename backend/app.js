const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet'); // Helmet is a very well rounded security plugin, used for many different reasons
/* Among other things, it secures our HTTP requests, secures the Headers, controls browser DNS prefetching, prevents clickjacking,
adds minor XSS protection and protects against MIME TYPE sniffing */

const saucesRoutes = require('./routes/sauces');
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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(cors());

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
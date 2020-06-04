const bcrypt = require('bcrypt'); // We need this plugin to hash passwords
const jwt = require('jsonwebtoken'); // This plugin is used to secure connections via unique tokens
const mailValidator = require('email-validator'); // Email validation plugin that acts as a regex
const passwordValidator = require('password-validator'); // Password validation plugin that will be configured later

const User = require('../models/User'); // We call the user model 

var schema = new passwordValidator(); // Declaration of a password validation in the form of a schema

schema
.is().min(8)  // Minimum 8 characters long
.is().max(30) // Maximum 30 characters long
.has().not().spaces();  // Password cannot have spaces

exports.signup = (req, res, next) => { // Function that allows users to register an account
  if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {  // Verification of email + password validity
      throw { error: "Merci de bien vouloir entrer une adresse email et un mot de passe valide !" }  // Fails if invalid
  } else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password))) {  // If both are valid
    bcrypt.hash(req.body.password, 10) // Password is Hashed + salted
    .then(hash => { // We then create an object containing the user information
      const user = new User({ 
        email: req.body.email,
        password: hash
      });
      user.save() // And we push this information to the DB
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => { // Function that allows users to log into the application
    User.findOne({ email: req.body.email }) // We check the email input and compare it to our DB collection
    .then(user => {
      if (!user) { // If the email isn't found, we throw an error
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // If the email exists, we first compare the password in the DB to the one that was input
        .then(valid => {
          if (!valid) { // If the passwords don't match, error !
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({ // However if the passwords match, the user is logged in
            userId: user._id,
            token: jwt.sign( // And a 24 hour token is generated, which will be compared throughout the connection
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
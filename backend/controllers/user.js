const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailValidator = require('email-validator'); // Email validation plugin that acts as a regex
const passwordValidator = require('password-validator'); // Password validation plugin that will be configured later

const User = require('../models/User');

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
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
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
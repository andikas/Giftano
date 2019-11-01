const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');

function generateSalt() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < 12; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

exports.createUserSalt = function(req, res, next) {
    console.log('req', req.body);
    var salt = generateSalt();
    var user = new User({
      username: req.body.username,
      password: '-',
      salt: salt,
    });
    user.save(function(err) {
      if (err) {
        return next(err);
      }
    });
    return res.json(salt);
  };

  exports.updateUserRegister = function(req, res, next){
    console.log('req', req.body);
    User.findOne({ username: req.body.username }).exec(function(err, user) {
        user.password = req.body.password;
        user.save(function(err) {
            if (err) {
              return next(err);
            }
            res.json(user);
        });
    });
  }

  function createToken(user) {
    // expiresIn = 43200 seconds = 12 Hours
    console.log('inside function', user)
    console.log('inside function', jsonwebtoken)
    var token = jsonwebtoken.sign(
      {
        id: user._id,
        username: user.username,
      },
      'KobeTest',
      {
        expiresIn: 43200,
      },
    );
      console.log('token', token);
    return token;
  }

  exports.login = function(req, res, next){
    User.findOne({ username: req.body.username }).exec(function(err, user) {
        if (err) {
            return next(err);
        }
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
        var dataResult = {};
            dataResult.success = false;
            dataResult.message = 'userPasswordMismatch';
            return res.json(dataResult);
        } else {
            var token = createToken(user);
            user.token = token;
                user.save(function(err, saved) {
                if (err) console.log('Got error when save user');
                var data = {
                    success: true,
                    message: 'Successfuly login!',
                    token: token,
                    user: user
                };
                return res.json(data);
            });
        }
    });
  }

  exports.getUserSalt = function(req, res, next) {
      User.findOne({ username: req.body.username }).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      var dataResult = {};
      if (!user) {
        dataResult.success = false;
        dataResult.message = 'userNotExist';
      } else {
        dataResult.success = true;
        dataResult.salt = user.salt;
      }
      res.json(dataResult);
    });
  };
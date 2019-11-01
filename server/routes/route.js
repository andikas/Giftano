const express = require('express');
const category = require('../controllers/category');
const book = require('../controllers/book');
const user = require('../controllers/user');

module.exports = function(app) {
    var api = express.Router();



    api.get('/category', category.list);
    api.post('/category', category.create);
    api.post('/category/updateAll', category.updateAll);

    api.get('/book', book.list);
    api.get('/book/:id', book.getBook);
    api.post('/book', book.create);
    api.post('/book/search', book.search);
    api.post('/book/update/:id', book.update);
    api.delete('/book/delete/:id', book.delete);

    api.post('/user', user.createUserSalt);
    api.post('/getUserSalt', user.getUserSalt);
    api.post('/user/update', user.updateUserRegister);
    api.post('/login', user.login);

    app.use('/api', api);
  
    return api;
  };
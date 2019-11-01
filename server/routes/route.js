const express = require('express');
const category = require('../controllers/category');
const book = require('../controllers/book');

module.exports = function(app) {
    var api = express.Router();



    api.get('/category', category.list);
    api.post('/category', category.create);

    api.get('/book', book.list);
    api.get('/book/:id', book.getBook);
    api.post('/book', book.create);
    api.post('/book/update/:id', book.update);
    api.delete('/book/delete/:id', book.delete);

    app.use('/api', api);
  
    return api;
  };
const Book = require('../models/book');
const Category = require('../models/category');
const async = require('async');
const mongoose = require('mongoose');

function populateData(data, string, callback){
  var temp = [];
  User.findOne({ token: string }).exec(function(err, user) {
    for (var i=0; i< data.length; i++){
      if (data[i].user._id.toString() == user._id.toString()){
        temp.push(data[i]);
      }else{
        if (data[i].status){
          temp.push(data[i]);
        }
      }
    }
    callback(temp);
  });
}

exports.list = function(req, res, next) {
  Book.find().populate('category').exec(function(err, allbooks) {
    if (err) next(err);
      res.json({allbooks});
    });
};

exports.getBook = function(req, res, next) {
    Book.findById(req.params.id).populate('category').exec(function(err, books) {
        if (err) next(err);
        res.json({books});
      });
  };

exports.create = function(req, res, next) {
  var book = new Book({ title: req.body.title, code: req.body.code, category: req.body.category });
    book.save(function(err) {
      if (err) {
        return next(err);
      }
      book.populate('category', function(err) {
        res.json(book);
      });
    });
};

exports.update = function(req, res, next) {
    Book.findById(req.params.id).exec(function(err, book) {
        if (err) next(err);
        book.title = req.body.title;
        book.code = req.body.code;
        book.category = req.body.category;
        book.save(function(err) {
            if (err) {
              return next(err);
            }
            book.populate('category', function(err) {
            res.json(book);
          });
        });
      });
  };

  exports.delete = function(req, res, next) {
    Book.findById(req.params.id).remove(function(err, book) {
      if (err) {
        return next(err);
      }
      res.json(book);
    });
  };
  
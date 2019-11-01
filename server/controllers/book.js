const Book = require('../models/book');
const Category = require('../models/category');
const User = require('../models/user');
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
  // var userID
  // async.series([
  //   function(callback) {
  //     if (!req.body.form.book.category){
  //       Category.find().exec(function(err, categories) {
  //         if (err) next(err);
  //         for (var i=0; i<categories.length; i++ ){
  //           if (categories[i].default){
  //             req.body.form.book.category = categories[i];
  //             callback();
  //           }
  //         }
  //       });
  //     }else{
  //       callback();
  //     }
  //   },function(callback) {
  //     getUser(req.headers.authorization, function (result) {
  //       userID = result;
  //       callback();

  //     });
  //   },function(callback) {
    console.log('req', req.body);
      var book = new Book({ title: req.body.title, code: req.body.code, category: req.body.category });
        book.save(function(err) {
          if (err) {
            return next(err);
          }
          book.populate('category', function(err) {
            res.json(book);
          });
        });
    // },
  // ]);
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

  // MyModel.find({$text: {$search: searchString}})
  // .skip(20)
  // .limit(10)
  // .exec(function(err, docs) { ... });

  exports.search = function(req, res, next) {
    // Book.find({$text: {$search: req.body.searchData.tile}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).exec(function(err, books) {
      console.log('req', req.body);
      var populateQuery = [{ path: 'category', match: {$or: [{ name: { $regex: req.body.searchData.category }}]} }, { path: 'user', match: {$or: [{ username: { $regex: req.body.searchData.author }}]} }]
      Book.find({ title: { $regex: `^${req.body.searchData.title}.*`, $options: "i" }}).populate(populateQuery).exec(function(err, allbooks) {
          if(err) next(err);
          populateData(allbooks, req.headers.authorization, function (books) {
            res.json({books});
          });
        }
      );
      // Book.find({"$or": [ { "title" : { $search: req.body.book }}, { "author" : { $search: req.body.book }}]}).exec(function(err, books) {
      
    // });
  };
  
  
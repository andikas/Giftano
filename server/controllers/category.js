const async = require('async');
const Category = require('../models/category');
const mongoose = require('mongoose');

exports.list = function(req, res, next) {
  console.log('inside server');
  // Category.find().exec(function(err, categories) {
  //   if (err) next(err);
  //   res.json({categories});
  // });
  Category.find().sort({path:1}).exec(function(err, comment){
    console.log('comment', comment);
    var temp = generateChild(comment);
    res.json(temp);
  });
};

exports.create = function(req, res, next) {
  var tempCount = "";
  async.series(
    [
      function(callback) {
        
        Category.find({name:req.body.name}).count(function(err, count){
          if (count != 0){
            tempCount = "-"+count.toString();
          }
          console.log('tempCount', tempCount);
          callback();
        });
      },function(callback) {
        console.log('req', req.body)
        if (req.body.newParent){
          var path = ","+req.body.name+tempCount+",";
          console.log('path',path);
          var category = new Category({ name: req.body.name, path: path });
          category.save(function(err) {
            if (err) {
              return next(err);
            }
           callback();
          });
        }else{
           Category.findById(mongoose.Types.ObjectId(req.body.parent)).exec(function(err, cat) {
            console.log('cat', cat);
            var path = cat.path+req.body.name+tempCount+",";
            console.log('path',path);
            var category = new Category({ name: req.body.name, path: path });
            category.save(function(err) {
              if (err) {
                return next(err);
              }
              callback();
            });
           });
        }
      }],
    function(err, result) {
      Category.find().sort({path:1}).exec(function(err, comment){
        console.log('comment', comment);
        var temp = generateChild(comment);
        res.json(temp);
      });
    });
};

exports.updateAll = function(req, res, next) {
  console.log('aaa',req.body);
  Category.remove().exec();
  Category.insertMany(req.body, function(error, docs) {
      if (err) {
      return next(err);
    }
    res.json(docs);
  });
  // category.save(function(err) {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.json(category);
  // });
};

generateChild = function(comment) {
  var collectPath = function(comment){
        return  {
            name: comment.name,
            path: comment.path,
            id: comment._id,
            comments: []
        };

    }
    console.log('collectPath',collectPath)
    var tplPath = [];

    var createChild = function(comment, currentNode, level){

        if(level == 1){
          console.log('inside if');
          comment.push(collectPath(currentNode));
        }else{
          console.log('inside else');
          createChild(comment[comment.length-1]['comments'], currentNode, level-1);
        }
        console.log('comment', comment);
        return;

    }
    console.log('1');
    for(var k in comment){
      let splitArray = comment[k].path.split(',');
      let level =  splitArray.length - 2;
      console.log('level', level);
      createChild(tplPath, comment[k], level);
    }
    return tplPath;
};

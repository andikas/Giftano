const async = require('async');
const Category = require('../models/category');
const mongoose = require('mongoose');

exports.list = function(req, res, next) {
  Category.find().sort({path:1}).exec(function(err, comment){
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
          callback();
        });
      },function(callback) {
        if (req.body.newParent){
          var path = ","+req.body.name+tempCount+",";
          var category = new Category({ name: req.body.name, path: path });
          category.save(function(err) {
            if (err) {
              return next(err);
            }
           callback();
          });
        }else{
           Category.findById(mongoose.Types.ObjectId(req.body.parent)).exec(function(err, cat) {
            var path = cat.path+req.body.name+tempCount+",";
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
        var temp = generateChild(comment);
        res.json(temp);
      });
    });
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
    var tplPath = [];

    var createChild = function(comment, currentNode, level){

        if(level == 1){
          comment.push(collectPath(currentNode));
        }else{
          createChild(comment[comment.length-1]['comments'], currentNode, level-1);
        }
        return;

    }
    for(var k in comment){
      let splitArray = comment[k].path.split(',');
      let level =  splitArray.length - 2;
      createChild(tplPath, comment[k], level);
    }
    return tplPath;
};

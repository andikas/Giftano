const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CategorySchema = new Schema(
  {
    // _id: { type: String, default: '' },
    name: { type: String, default: '' },
    path: { type: String, default: '' },
    ancestors: [],
    parents: []
  },
  {
    timestamps: true,
  },
);

CategorySchema.virtual('level').get(function() {
    return this.path.split(',').length;
});

var Category = mongoose.model('Category', CategorySchema);


module.exports = Category;

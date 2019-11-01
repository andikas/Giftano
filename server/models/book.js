const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    title: { type: String, default: '' },
    code: { type: String, default: '' },
    // user: { type: Schema.Types.ObjectId, ref: 'User' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  {
    timestamps: true,
  },
);

BookSchema.index({'$**': 'text'});

const Book = mongoose.model('Book', BookSchema);


module.exports = Book;

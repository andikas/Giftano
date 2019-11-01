const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, default: '' },
    password: { type: String, default: '' },
    salt: { type: String, default: '' },
    token: { type: String },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.comparePassword = function(password) {
	var user = this;
	if (user.password == password) {
		return true;
	} else {
		return false;
	}
};

const User = mongoose.model('User', UserSchema);


module.exports = User;

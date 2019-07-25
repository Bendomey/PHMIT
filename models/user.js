const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique:true,
    required:true
  },
  email: {
    type: String,
    trim: true,
    required:true
  },
  password: {
    type: String,
  },
  isAdmin:{
    type:String,
    enum:['0','1'],
    trim:true,
    required:true
  },
  resetPasswordToken: String,
  resetPasswordExpires:Date,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at:{
    type:Date,
    default:Date.now
  }
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

UserSchema.virtual('role',{
  ref:'Role',
  localField:'_id',
  foreignField:'user',
  justOne:true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

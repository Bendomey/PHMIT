const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
  accessory:{
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:'Accessories'
  },
  department:{
    type:mongoose.Schema.ObjectId,
    ref:'Department',
    required:true
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  },
  problem_description:{
    type:String,
    required:true,
    trim:true
  },
  solution_description:{
    type:String,
    required:true,
    trim:true
  },
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

SolutionSchema.virtual('departments',{
  ref:'Department',
  localField:'department',
  foreignField:'_id',
  justOne:true
});

SolutionSchema.virtual('accessories',{
  ref:'Accessories',
  localField:'accessory',
  foreignField:'_id',
  justOne:true
});

SolutionSchema.virtual('users',{
  ref:'User',
  localField:'user',
  foreignField:'_id',
  justOne:true
});

const Solution = mongoose.model('Solution', SolutionSchema);

module.exports = Solution;

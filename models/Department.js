const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  department_name: {
    type: String,
    trim: true,
    required:true
  },
  department_code:{
    type:String,
    trim:true,
    required:true
  },
  HOD:{
    type:String,
    trim:true,
    required:true
  },
  accessories:[],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at:{
    type:Date,
    default:Date.now
  }
});

const Department = mongoose.model('Department', DepartmentSchema);

module.exports = Department;

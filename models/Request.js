const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
	name:{
		type:String,
		required:true,
		trim:true
	},
	department:{
		type:mongoose.Schema.ObjectId,
		ref:'Department',
		required:true
	},
	department_name:{
		type:String,
		required:true
	},
	problem_description:{
		type:String,
		required:true,
		trim:true
	},
	status:{
		type:String,
		enum:['0','1'],
		required:true
	},
	created_at:{
		type:Date,
		default:Date.now
	},
	updated_at:{
		type:Date,
		default:Date.now
	}
},{
	toJSON:{virtuals:true,},
	toObect:{virtuals:true}
});

const Request = mongoose.model('Request',RequestSchema);
module.exports = Request;
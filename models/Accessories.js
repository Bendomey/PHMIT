const mongoose = require('mongoose');

const AccessoriesSchema = new mongoose.Schema({
	name:{
		type:String,
		trim:true,
		required:true
	},
	id:{
		type:String,
		trim:true,
		required:true
	},
	department:{
		type:mongoose.Schema.ObjectId,
		ref:'Department',
		required:true
	},
	created_at:{
		type:Date,
		required:true,
		default:Date.now
	},
	updated_at:{
		type:Date,
		required:true,
		default:Date.now
	}
});

const Accessories = mongoose.model('Accessories',AccessoriesSchema);
module.exports = Accessories;
const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
	user:{
		type:mongoose.Schema.ObjectId,
		ref:'User',
		required:true
	},
	edit_solution:{
		type:String,
		enum:['0','1'],
		required: true
	},
	delete_solution:{
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
});

const Role = mongoose.model('Role',RoleSchema);
module.exports = Role;
const mongoose = require('mongoose')
const User = require('../models/user')
const Department = mongoose.model('Department')
const Solution = mongoose.model('Solution')
const Role = mongoose.model('Role');

exports.homepage = async (req, res) => {
	let solution = await Solution.countDocuments();
	let department = await Department.countDocuments();
	let users = await User.countDocuments();
	res.render('dashboard',{
  		title:'Welcome',
  		solution,
  		department,
  		users
	})
};

exports.sorryPage = (req, res) => {
	res.render('sorry_page',{
		title:'Sorry Page'
	});
};

exports.assignRolesPage = async (req, res) => {
	let page = req.params.page || 1;
	let limit = 10;
	let skip = (page*limit) - limit;

	let usersPromise =  User
	.find({isAdmin:'0'})
	.skip(skip)
	.limit(limit)
	.populate('role');

	let countPromise = User.countDocuments({isAdmin:'0'})

	const [users, count] = await Promise.all([usersPromise, countPromise]);
	let pages = Math.ceil(count/limit);
	
	res.render('Users/assign_roles',{
		title:'Assign Roles',
		users,
		page,
		pages,
		count
	});
};

exports.editUserRoles = async (req, res) => {
	let user = await User.findOne({_id:req.body.id});
	await Role.updateOne({user:req.body.id},{
		$set:{
			edit_solution:req.body.edit_solution,
			delete_solution:req.body.delete_solution
		},
		$currentDate:{
			"updated_at":true
		}
	});
	req.flash('success_msg', `Congratulations, you have edited this user - ${user.name}`)
	res.redirect('back');
};

exports.removeUser = async (req, res) => {
	let user = await User.findOne({_id:req.params.id});
	await User.remove({_id:req.params.id});
	await Role.remove({user:req.params.id});
	await Solution.remove({user:req.params.id});

	req.flash('success_msg',`Congratulation, ${user.name} has been removed`);
	res.redirect('back');
};

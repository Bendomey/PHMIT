const mongoose = require('mongoose')
const User = require('../models/user')
const Department = mongoose.model('Department')
const Solution = mongoose.model('Solution')
const Role = mongoose.model('Role');
const bcrypt = require('bcryptjs');

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
	.find({
		_id:{
			$ne:req.user._id
		}
	})
	.skip(skip)
	.limit(limit)
	.populate('role');

	let countPromise = User.countDocuments({
		_id:{
			$ne:req.user.id
		}
	})

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

exports.inputSanctification = async (req, res, next) => {
	req.checkBody('username', 'User field cannot be empty');
	req.checkBody('password', 'Password field cannot be empty');
	req.checkBody('confirm_password','Oops, your passwords do not match').equals(req.body.password);
	let errors = req.validationErrors();
	if(errors){
		req.flash('error_msg',errors.map(err => err.msg));
		res.redirect('back');
		return;
	}

	next();
}

exports.editAccount = async (req, res) => {
	// res.send(req.body)
	User.findOne({_id:req.body.id})
	.then(user => {
		user.password = req.body.password;
		user.updated_at = Date.now();
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err,hash) => {
				if(err) throw err;
				user.password = hash;
				user
				.save()
				.then(user => {
	                req.flash(
	                  'success_msg',
	                  `${user.name}'s profile has been reset successfully`
	                );
	                return res.redirect('back');
	            })
	              .catch(err => console.log(err));
			})
		})
	})
};

exports.removeUser = async (req, res) => {
	let user = await User.findOne({_id:req.params.id});
	await User.remove({_id:req.params.id});
	await Role.remove({user:req.params.id});
	await Solution.remove({user:req.params.id});

	req.flash('success_msg',`Congratulation, ${user.name} has been removed`);
	res.redirect('back');
};

const mongoose = require('mongoose');
const Solution = mongoose.model('Solution')
const Department = mongoose.model('Department');
const Accessories = mongoose.model('Accessories');
const User = require('../models/user');

exports.addSolutionPage = async (req,res) =>{
	let departments = await Department.find();
	res.render('solution/add',{
		title:'Add Solution',
		departments,
	});
};

exports.getAccessoriesForDepartment = async (req, res) => {
	let accessories = await Accessories.find({department:req.params.id})
	return res.json(accessories);
}

exports.addSolutionAction = async (req, res) => {
	req.body.user = req.user._id;
	let solution = new Solution(req.body);
	await solution.save();
	req.flash('success_msg','Solution added successfully');
	res.redirect('back');
};

exports.viewSolutionPage = async (req, res) => {
	let page = req.params.page || 1;
	let limit = 10;
	let skip = (page*limit) - limit;

	let solutionsPromise = Solution
	.find()
	.skip(skip)
	.limit(limit)
	.populate(['departments','accessories','users'])

	let countPromise = Solution.countDocuments();

	const [solutions, count] = await Promise.all([solutionsPromise, countPromise]);
	let pages = Math.ceil(count/limit);

	let user_roles = await User.findOne({_id:req.user._id}).populate('role');
	// res.send(user_roles)
	let departments = await Department.find();
	res.render('solution/view',{
		title:'View Solutions',
		solutions,
		count,
		pages,
		page,
		departments,
		user_roles
	});
};

exports.editSolutionAction = async (req, res) => {
	await Solution.updateOne({_id:req.body.id},{
		$set:{
			accessory:req.body.accessory,
			department:req.body.department,
			problem_description:req.body.problem_description,
			solution_description:req.body.solution_description
		},
		$currentDate:{
			"updated_at":true
		}
	});
	req.flash('success_msg',`Congratulations, you have successfully updated this solution`);
	res.redirect('back');
};

exports.deleteSolutionAction = async (req, res) => {
	let solution = await Solution.findOne({_id:req.params.id});
	await solution.delete();
	req.flash('success_msg','Congratulations, you have successfully deleted the solution');
	res.redirect('back');
}
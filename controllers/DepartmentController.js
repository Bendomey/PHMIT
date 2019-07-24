const mongoose = require('mongoose');
const Department = mongoose.model('Department');
const Accessories = mongoose.model('Accessories');

exports.addDepartmentPage = (req, res) => {
	res.render('department/add',{
		title:'Add Deparment'
	});
};

exports.addDepartmentAction = async (req, res) => {

	let department = new Department(req.body);
	await department.save();
	req.flash('success_msg',`Congratulations, ${req.body.department_name} has been added successfully`);
	res.redirect('back');
};

exports.viewDepartmentPage = async (req, res) => {
	let page = req.params.page || 1;
	let limit = 10;
	let skip = (page*limit) - limit;

	let departmentPromise = Department
	.find()
	.skip(skip)
	.limit(limit)

	let countPromise = Department.countDocuments()

	const [department, count] = await Promise.all([departmentPromise, countPromise]);
	let pages = Math.ceil(count/limit);
	
	res.render('department/view',{
		title:'View Department',
		department,
		count,
		pages,
		page
	});
};

exports.editDepartmentAction = async (req, res) => {
	await Department.updateOne({_id:req.body.id},{
		$set:{
			department_name:req.body.department_name,
			HOD:req.body.HOD
		},
		$currentDate:{
			"updated_at":true
		}
	});
	req.flash('success_msg',`Congratulations, ${req.body.department_name} has been updated`);
	res.redirect('back');	
};

exports.deleteDepartmentAction = async (req, res) => {
	let department = await Department.findOne({_id:req.params.id});
	let name = department.department_name;
	//removing all accessories
	await Accessories.deleteMany({department:req.params.id});
	await department.delete();
	req.flash('success_msg',`Congratulations, you have successfully deleted ${name} department`);
	res.redirect('back');
}

exports.manageDepartmentPage = async (req,res)=>{
	let allDepartment = await Department.find();
	let department = await Department.findOne({_id:req.params.id});

	let page = req.params.page || 1;
	let limit = 10;
	let skip = (page*limit) - limit;

	let accessoriesPromise = Accessories
	.find({department:req.params.id})
	.skip(skip)
	.limit(limit)

	let countPromise = Accessories.count({department:req.params.id});

	const [accessories, count] = await Promise.all([accessoriesPromise, countPromise]);
	let pages = Math.ceil(count/limit);
	res.render('department/manage',{
		title:`Manage ${department.department_name}`,
		accessories,
		id:department._id,
		department:allDepartment,
		count,
		pages,
		page
	});
};
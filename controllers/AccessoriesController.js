const mongoose = require('mongoose');
const Accessories = mongoose.model('Accessories');
const Department = mongoose.model('Department');

exports.addAccessoriesPage = (req,res) => {

	res.render('department/add_accessory',{
		title:'Add Accessories',
		id:req.params.id
	});
};

exports.addAccessoryAction = async (req, res) => {
	let department = await Department.findOne({_id:req.params.id});
	req.body.department = req.params.id;
	// res.send(req.body)
	if(req.body.id == "" && req.body.chooseFunction == 'generate'){
		req.body.id = 'PHM' + department.department_code + generateRandom();
	}else if(req.body.id == "" && req.body.chooseFunction == 'default'){
		req.flash('error_msg','Please all fields are neccessary');
		res.redirect('back');
	}else if(req.body.id == "" && req.body.chooseFunction == 'specify'){
		req.flash('error_msg','Please all fields are neccessary');
		res.redirect('back');
	}else if(req.body.id != "" && req.body.chooseFunction == 'specify'){
		req.body.id = 'PHM'+ department.department_code + req.body.id;
	}
	let accessories = new Accessories(req.body);
	await accessories.save();
	req.flash('success_msg',`${req.body.name} has successfully been added to the ${department.department_name} department`);
	res.redirect('back');
};

const generateRandom = () => {
	return Math.floor(1000 + Math.random() * 9000);
}

exports.editAccessoryAction = async (req, res) => {
	await Accessories.updateOne({_id:req.body.accessid},{
		$set:{
			name:req.body.name,
			id:req.body.id
		},
		$currentDate:{
			"updated_at":true
		}
	});
	req.flash('success_msg',`Congratulations, ${req.body.name} has been updated`);
	res.redirect('back');

};

exports.deleteAccessoryAction = async (req, res) => {
	let accessory = await Accessories.findOne({_id:req.params.id});
	let id = accessory.id;
	let name = accessory.name;
	await accessory.delete();
	req.flash('success_msg',`Congratulations, you have successfully deleted ${name}(${id}) accessory`);
	res.redirect('back');
};

exports.moveAccessoryAction = async (req, res) => {
	if(req.body.move_department == 'default'){
		req.flash('error_msg',`Sorry, all fields are required to move the accessory`);
		res.redirect('back');
	}
	let department = await Department.findOne({_id:req.body.move_department});
	let accessory = await Accessories.findOne({_id:req.body.accessid});
	// let a = req.body.id;
	await Accessories.updateOne({_id:req.body.accessid},{
		$set:{
			department:department._id,
			// id:"PHM" + department.department_code + a[a.length-4] + a[a.length-3] + a[a.length-2] + a[a.length-1]
			id:req.body.id
		},
		$currentDate:{
			"updated_at":true
		}
	});
	req.flash('success_msg',`Congratultions, ${accessory.name}(${accessory.id}) has been moved to the ${department.department_name} department`);
	res.redirect('back');
};
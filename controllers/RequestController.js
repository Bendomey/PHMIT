const mongoose = require('mongoose');
const Request = mongoose.model('Request');
const Department = mongoose.model('Department');
const Pusher = require('pusher');

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_APP_KEY,
	secret: process.env.PUSHER_APP_SECRET,
	cluster: process.env.PUSHER_APP_CLUSTER,
	useTLS: true
});


exports.index = async (req, res) => {
	let departments = await Department.find();
	res.render('Client/request_service',{
		departments
	});
}

exports.sanctifyInputs = (req, res, next) => {
	req.checkBody('name','Name field cannot be empty');
	req.checkBody('department','Department field cannot be empty');
	req.checkBody('problem_description','Problem Description cannot be empty');
	let errors = req.validationErrors();
	if(errors){
		req.flash('error_msg',errors.map(err => err.msg));
		res.redirect('back');
		return;
	}

	next();
};

exports.pusher_auth = async (req, res) => {
	let socketId = req.body.socket_id;
	let channel = req.body.channel_name;
	let presenceData = {
		user_id:req.user.id,
		user_info:{
			name:req.user.name,
		}
	}
	let auth = pusher.authenticate(socketId, channel, presenceData);
	res.send(auth);
}

exports.saveRequest = async (req, res) => {
	let request = new Request();
	request.name = req.body.name;
	request.department = req.body.department;
	let department = await Department.findOne({_id:req.body.department});
	request.department_name = department.department_name;
	request.status = '0';
	request.problem_description = req.body.problem_description;
	await request.save();
	await pusher.trigger('presence-notification','new_request',{
			"message":`${req.body.name} sent you a request`
	})
	req.flash('success_msg','Your request has been sent');
	res.redirect('back');
};

exports.get_data = async (req, res) => {
	let requests = await Request.find();
	res.json(requests);
};



$(document).ready(function(){

	//
	$('#chooseFunction').change(function(){
		let selected = $(this).children('option:selected').val();
		if(selected == 'specify'){
			$('#accessoryID').css('display','block');
		}else{
			$('#accessoryID').css('display','none');
		}
	});


	$('.editDepartment').click(function(){
		let data = $(this).data('department');
		$('.output').html(data.department_name)
		$('.deptName').append(data.department_name);
		$('.departmentId').val(data._id);
		$('.departmentName').val(data.department_name);
		$('.departmentHOD').val(data.HOD);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#editModal"
		});
	});

	$('.deleteDepartment').click(function(){
		let data = $(this).data('id');
		$('.removeDeptBtn').attr('href',`/department/delete/${data}`);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#deleteModal"
		});
	});

	$('.editAccessoryBtn').click(function(){
		let data = $(this).data('accessory');
		$('.accessoryId').val(data._id);
		$('.accessoryName').val(data.name);
		$('.accessoryID').val(data.id);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#editAccessoryModal"
		});
	});

	$('.deleteAccessoryBtn').click(function(){
		let data = $(this).data('accessory');
		$('.removeAccessoryBtn').attr('href',`/accessory/delete/${data}`);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#deleteAccessoryModal"
		});
	});

	$('.moveAccessory').click(function(){
		let data = $(this).data('accessory');
		$('.accessoryId').val(data._id);
		$('.accessoryID').val(data.id);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#moveAccessoryModal"
		});
	})

	//ajax for accessories 
	$('#solution_dept').change(function(){
		let selected = $(this).children('option:selected').val();
		$('#outputAccessories').empty()
		$('#outputAccessories').append("<option value='default'>Please Select...</option>")	
		// if(selected != default){
			$.ajax({
				method:'get',
				dataType:'JSON',
				url:`/solution/add/get_accessories/${selected}`,
				success:(data)=>{
					// alert(data)
					if(data.length > 0){
						for(i=0; i < data.length; i++){
							$('#outputAccessories').append(`<option value=${data[i]._id}>${data[i].id}</option>`)												
						}
					}
				},
				error:(err)=>{
					console.log(err.msg)
				}
			});	
		// }	
		
	});

	$('.solutionViewBtn').click(function(){
		let data = $(this).data('solution');
		$('.solutionUser').val(data.users.name || 'Unknown User');
		$('.solutionDepartment').val(data.departments.department_name);
		$('.solutionAccessory').val(data.accessories.id);
		$('.problemDescribe').val(data.problem_description);	
		$('.solutionDescribe').val(data.solution_description);	
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#viewSolutionModal"
		});
	});

	$('.solutionEditBtn').click(function(){
		let data = $(this).data('solution');
		$('.solutionIdAlter').val(data._id);
		$('.solutionUserAlter').val(data.users._id);
		$('.solutionDepartmentAlter').append(`<option value=${data.departments._id} hidden selected>${data.departments.department_name}</option>`)
		$('.solutionAccessoryAlter').append(`<option value=${data.accessories._id} hidden selected>${data.accessories.id}</option>`)
		$('.problemDescribeAlter').val(data.problem_description);	
		$('.solutionDescribeAlter').val(data.solution_description);	
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#editSolutionModal"
		});
	});

	$('.solutionDeleteBtn').click(function(){
		let data = $(this).data('solution');
		$('.removeSolutionBtn').attr('href',`/solution/delete/${data}`);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#deleteSolutionModal"
		})
	})
});
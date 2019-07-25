
function search(a,b) {
  // Declare variables 
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(a);
  filter = input.value.toUpperCase();
  table = document.getElementById(b);
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}
$(document).ready(function(){

	$('.editAccount').click(function(){
		$('#username').removeAttr('disabled');
		$('#email').removeAttr('disabled');
		$(this).addClass('d-none');
		$('.submitAccountSetting').removeClass('d-none')
	});

	$('.deleteBtnForUser').click(function(){
		let data = $(this).data('user');
		$('.deleteUserButton').attr('href',`/users/delete/${data}`);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#deleteUserModal"
		});
	});

	$('.assignRoleBtnUser').click(function(){
		let data = $(this).data('user');
		$('#userID').val(data._id);
		$('#editSolution').append(`<option selected hidden value=${data.role.edit_solution}>${data.role.edit_solution == '1' ? 'Allowed' :'Denied'}</option>`);
		$('#deleteSolution').append(`<option selected hidden value=${data.role.delete_solution}>${data.role.delete_solution == '1' ? 'Allowed' : 'Denied'}</option>`);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#assignRoleUserModal"
		})
	});

	$('.editBtnForUser').click(function(){
		let data = $(this).data('user');
		alert(data._id)
		$('#userID1').val(data._id);
		$('#username').val(data.name);
		$('#password').val(data.password);
		$('#confirm_password').val(data.password);
		$(this).attr({
			"data-toggle":"modal",
			"data-target":"#editUserModal"
		});
	});

	$('#confirm_password').focusout(function(event){
		// alert($('#password')))
		if($(this).val() !== $('#password').val() ){
			$('.passwordNotEqual').removeClass('d-none');
		}else{
			$('.passwordNotEqual').addClass('d-none')
		}
	})
	// $('#searchDepartment').on('keyup',function(){
	// 	let val = $(this).val().toLowerCase();
	// 	let table = $('#departmentTable');
	// 	let tr = $('tr');
	// 	for (i = 0; i < tr.length; i++) {
	// 	    td = tr[i].getElementsByTagName("td")[0];
	// 	    if (td) {
	// 	      txtValue = td.textContent || td.innerText;
	// 	      if (txtValue.toUpperCase().indexOf(filter) > -1) {
	// 	        tr[i].style.display = "";
	// 	      } else {
	// 	        tr[i].style.display = "none";
	// 	      }
	// 	    }
	// })

});

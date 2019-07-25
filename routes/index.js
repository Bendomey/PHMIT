const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, ensureAdministrator } = require('../config/auth');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/user');
const { catchErrors } = require('../config/errorHandlers');
//controllers
const dashboardController = require('../controllers/DashboardController');
const authController = require('../controllers/authController');
const solutionController = require('../controllers/SolutionController');
const departmentController = require('../controllers/DepartmentController');
const accessoriesController = require('../controllers/AccessoriesController');
const requestController = require('../controllers/RequestController');

//for client
router.get('/', requestController.index);
router.post('/send_request', requestController.sanctifyInputs, catchErrors(requestController.saveRequest));
router.post('/pusher/auth', catchErrors(requestController.pusher_auth));
router.get('/requests/get_data', catchErrors(requestController.get_data));

router.get('/dashboard', ensureAuthenticated, catchErrors(dashboardController.homepage));

router.get('/sorry_page', ensureAuthenticated, dashboardController.sorryPage);

router.get('/edit_profile', ensureAuthenticated, authController.updateProfilePage);
router.post('/edit_password', authController.updatePassword);
router.post('/edit_profile', authController.updateProfile);

//for departments
router.get('/department/add',ensureAuthenticated, departmentController.addDepartmentPage);
router.post('/department/add/action',ensureAuthenticated, catchErrors(departmentController.addDepartmentAction));
router.get('/department/view',ensureAuthenticated, catchErrors(departmentController.viewDepartmentPage));
router.get('/department/view/page/:page',ensureAuthenticated, catchErrors(departmentController.viewDepartmentPage));
router.post('/department/edit/action',ensureAuthenticated,catchErrors(departmentController.editDepartmentAction));
router.get('/department/delete/:id',ensureAuthenticated, catchErrors(departmentController.deleteDepartmentAction));
router.get('/department/manage/:id',ensureAuthenticated,catchErrors(departmentController.manageDepartmentPage));
router.get('/department/manage/:id/page/:page',ensureAuthenticated,catchErrors(departmentController.manageDepartmentPage));

//for accessories
router.get('/department/manage/:id/add_accessory',ensureAuthenticated,accessoriesController.addAccessoriesPage);
router.post('/department/manage/:id/add_accessory',ensureAuthenticated,catchErrors(accessoriesController.addAccessoryAction));
router.get('/accessory/delete/:id',ensureAuthenticated,catchErrors(accessoriesController.deleteAccessoryAction))
router.post('/accessory/update',ensureAuthenticated,catchErrors(accessoriesController.editAccessoryAction))
router.post('/accessory/move',ensureAuthenticated,catchErrors(accessoriesController.moveAccessoryAction));

//for solutions
router.get('/solution/add',ensureAuthenticated, catchErrors(solutionController.addSolutionPage));
router.get('/solution/add/get_accessories/:id',ensureAuthenticated, catchErrors(solutionController.getAccessoriesForDepartment));
router.post('/solution/add',ensureAuthenticated, catchErrors(solutionController.addSolutionAction));
router.get('/solution/view',ensureAuthenticated, solutionController.viewSolutionPage);
router.get('/solution/view/page/:page',ensureAuthenticated, solutionController.viewSolutionPage);
router.post('/solution/edit',ensureAuthenticated, ensureAdministrator,catchErrors(solutionController.editSolutionAction));
router.get('/solution/delete/:id',ensureAuthenticated, ensureAdministrator, catchErrors(solutionController.deleteSolutionAction));

//for users
router.get('/users/assign_roles',ensureAuthenticated, ensureAdministrator, catchErrors(dashboardController.assignRolesPage));
router.get('/users/assign_roles/page/:page',ensureAuthenticated, ensureAdministrator, catchErrors(dashboardController.assignRolesPage));
router.get('/users/delete/:id',ensureAuthenticated, ensureAdministrator, catchErrors(dashboardController.removeUser));
router.post('/users/assign_roles',ensureAuthenticated,ensureAdministrator, catchErrors(dashboardController.editUserRoles));

module.exports = router;

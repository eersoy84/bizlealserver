const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/user.validation');
const authController = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
  .post(auth('manageUsers'), validate(authValidation.createUser), authController.createUser)
  .get(auth('getUsers'), validate(authValidation.getUsers), authController.getUsers);

router.route('/:userId')
  .get(auth('getUsers'), validate(authValidation.getUser), authController.getUser)
  .patch(auth('manageUsers'), validate(authValidation.updateUser), authController.updateUser)
  .delete(auth('manageUsers'), validate(authValidation.deleteUser), authController.deleteUser);

module.exports = router;



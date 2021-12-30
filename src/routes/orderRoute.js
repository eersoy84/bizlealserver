const express = require('express');
const validate = require('../middlewares/validate');

const orderValidation = require('../validations/orderValidation');
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/rateItem', auth(), validate(orderValidation.rateItem), orderController.rateItem);
router.post('/rateSeller', auth(), validate(orderValidation.rateSeller), orderController.rateSeller);
router.post('/cancelProduct', auth(), validate(orderValidation.cancelProduct), orderController.cancelProduct);
// router.post('/returnProduct', auth(), validate(orderValidation.returnProduct), orderController.returnProduct);

module.exports = router;


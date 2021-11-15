const express = require('express');
const validate = require('../middlewares/validate');
const cartValidation = require('../validations/cartValidation');
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/list', auth(), cartController.getCartList);
router.post('/get', auth(), validate(cartValidation.cartGet), cartController.cartGet);
router.post('/getBySeller', auth(), validate(cartValidation.cartGetBySeller), cartController.cartGetBySeller);
router.post('/update', auth(), validate(cartValidation.cartUpdate), cartController.cartUpdate);



module.exports = router;

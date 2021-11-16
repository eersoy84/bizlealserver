const express = require('express');
const validate = require('../middlewares/validate');
const cartValidation = require('../validations/cartValidation');
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');
const { findCacheByBody } = require('../middlewares/cacheManager');

const router = express.Router();

router.get('/list', auth(), findCacheByBody(), cartController.getCartList);
router.post('/get', auth(), findCacheByBody(), validate(cartValidation.cartGet), cartController.cartGet);
router.post('/getBySeller', auth(), findCacheByBody(), validate(cartValidation.cartGetBySeller), cartController.cartGetBySeller);
router.post('/update', auth(), validate(cartValidation.cartUpdate), cartController.cartUpdate);



module.exports = router;

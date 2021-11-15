const express = require('express');
const validate = require('../middlewares/validate');
const sellerValidation = require('../validations/sellerValidation');
const sellerController = require('../controllers/sellerController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/list', auth(), sellerController.getSellerList);
router.post('/ads', auth(), validate(sellerValidation.ads), sellerController.getSellerAds);
router.post('/orders', auth(), validate(sellerValidation.orders), sellerController.getSellerOrders);
router.post('/answerQuestion', auth(), validate(sellerValidation.answerQuestion), sellerController.answerQuestion);



module.exports = router;

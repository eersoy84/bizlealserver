const express = require('express');
const validate = require('../middlewares/validate');
const sellerValidation = require('../validations/sellerValidation');
const sellerController = require('../controllers/sellerController');
const auth = require('../middlewares/auth');
const { findCacheByBody } = require('../middlewares/cacheManager');

const router = express.Router();

router.get('/list', auth(), findCacheByBody(), sellerController.getSellerList);
router.post('/ads', auth(), findCacheByBody(), validate(sellerValidation.ads), sellerController.getSellerAds);
router.post('/orders', auth(), findCacheByBody(), validate(sellerValidation.orders), sellerController.getSellerOrders);
router.post('/answerQuestion', auth(), validate(sellerValidation.answerQuestion), sellerController.answerQuestion);



module.exports = router;

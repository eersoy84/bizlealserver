const express = require('express');
const validate = require('../middlewares/validate');


const routineValidation = require('../validations/routineValidation');

const routineController = require('../controllers/routineController');
const auth = require('../middlewares/auth');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// router.post('/deleteAddress', validate(routineValidation.login), authController.login);


router.get('/ads', isAuth(), routineController.getAds); // calls exposed_list_ads()
router.get('/ads-cdn', routineController.getAdsCdn); // calls ads_calc()
router.get('/instantadinfo', routineController.getInstantAdInfo); //calls exposed_instant_ad_info
router.get('/favorites', auth(), routineController.getFavorites);


router.post('/follow', auth(), validate(routineValidation.follow), routineController.follow);
router.post('/unfollow', auth(), validate(routineValidation.unfollow), routineController.unfollow);
// router.get('/orders', auth(), routineController.getOrders); //kullanılmıyor

router.post('/getbin', validate(routineValidation.bin), routineController.getBin); // kullanılmıyor 
router.post('/setAddress', auth(), validate(routineValidation.setAddress), routineController.setAddress);//api =>/address
router.post('/deleteAddress', auth(), validate(routineValidation.deleteAddress), routineController.deleteAddress);





module.exports = router;


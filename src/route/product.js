const express = require('express');

const router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'src/public/uploads'});

const productController = require('./../app/controllers/ProductController');
const authModule = require('./../app/utills/index');

router.post('/create',productController.crete);
router.post('/store', upload.single('image'),productController.store);
router.post('/reviews/:slug',authModule.isAuth,productController.postReview);
router.get('/reviews/:slug', productController.getReviews);
router.get('/edit/:id',productController.edit);
router.get('/:slug',productController.show);
router.get('/',productController.index);


module.exports = router;
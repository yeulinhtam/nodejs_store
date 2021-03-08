const express = require('express');

const router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'src/public/uploads' });

const authModule = require('./../app/utills/index');
const userController = require('./../app/controllers/UserController');

router.post('/create', userController.create);
router.get('/', authModule.isAuth, userController.index);
router.post('/login', userController.login);
router.put('/:id', authModule.isAuth, upload.single('image'), userController.upload);



module.exports = router;
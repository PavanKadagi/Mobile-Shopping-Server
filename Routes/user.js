const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate')
const {getAllProducts,verifyPassword,resetPassword,singleProduct,userSignUp,verifyMail,forgetPassword,userSignIn,userLogout,sendVerificationLink} = require('../Controller/user')

router.route('/products').get(getAllProducts)
router.route('/single').get(singleProduct);
router.route('/signup').post(userSignUp);
router.route('/verify').get(verifyMail);
router.route('/signin').post(userSignIn);
router.route("/logout").get(authenticate, userLogout);
router.route('/verification').post(sendVerificationLink)
router.route('/forget').post(forgetPassword);
router.route('/forget-password').patch(verifyPassword)
router.route('/forget-password').post(resetPassword);
module.exports = router;
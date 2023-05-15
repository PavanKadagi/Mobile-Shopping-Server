const express = require('express');
const router = express.Router();

const {addAllProducts } = require('../Controller/admin')

router.route('/addproducts').post(addAllProducts)


module.exports = router;
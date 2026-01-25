const express = require('express');
const router = express.Router();

router.use('/', require('./product.routes'));

module.exports = router;

var express = require('express'),
    router = express.Router();

//index the controllers
router.use('/trip', require('./trip'));

//add a new route following this example
//router.use('/example', require('./example'));

module.exports = router;

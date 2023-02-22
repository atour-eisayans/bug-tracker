const { Router } = require('express');

const accountRoutes = require('./routes/account.routes');
const requestRoutes = require('./routes/request.routes');
const itemRoutes = require('./routes/item.routes');

const router = Router();

router.use('/account', accountRoutes);
router.use('/item', itemRoutes);
router.use('/request', requestRoutes);

module.exports = router;

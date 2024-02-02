const { Router } = require('express');
const controller = require('../controllers/controller');
const router = Router();

router.post('/processrequest', controller.processRequest);
router.get('/getContractAddress', controller.getContractAddress);

router.get('/getAuthContractABI', controller.getAuthContractABI);


module.exports = router;
const { Router } = require('express');
const controller = require('../controllers/controller');
const router = Router();

const multer = require('multer');
const upload = multer();

router.post('/processrequest', controller.processRequest);
router.get('/getContractAddress', controller.getContractAddress);
router.get('/getAuthContractABI', controller.getAuthContractABI);
router.get('/getRequestServiceContractABI', controller.getRequestServiceContractABI);
router.get('/getaiServiceContractABI', controller.getaiServiceContractABI);
router.get('/login', controller.getLogin);


module.exports = router;
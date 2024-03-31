const { Router } = require('express');
const controller = require('../controllers/controller');
const router = Router();

const multer = require('multer');
const upload = multer();


router.post('/login',controller.postLogin);
router.get('/login', controller.getLogin);
router.get('/logout', controller.logout);
router.post('/processrequest', controller.processRequest);
router.get('/getContractAddress', controller.getContractAddress);
router.get('/getAuthContractABI', controller.getAuthContractABI);
router.get('/getRequestServiceContractABI', controller.getRequestServiceContractABI);
router.get('/getaiServiceContractABI', controller.getaiServiceContractABI);
router.get('/getRequests', controller.getRequests);
router.get('/getServices', controller.getServices);
router.get('/getIndividualService/:id', controller.getIndividualService);
router.get('/getUserDetails/:id',controller.getUserDetails)


module.exports = router;
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config('../.env');
const fs = require('fs');
const path = require('path');
const { Web3 } = require('web3');
let provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

let web3 = new Web3(provider);

module.exports.processRequest = async (req, res) => {
    const formData = req.body;
    console.log(formData);
    const email = req.body.email;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: "login",
            user: process.env.MAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.MAIL,
        to: [email, process.env.MAIL],
        subject: "Request Received for AI Service",
        //text: "That was pretty easy..!!"
        html: JSON.stringify(formData),

    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Mail Sent!!' + info.response);
        }
    });
    res.json({ success: true, message: 'Form data received successfully' });
};

module.exports.getContractAddress = (req,res) => {
    const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
    const contractAddresses = JSON.parse(fs.readFileSync(filePath));
    // Now you can use the contract addresses as needed
    console.log("Authenticate Contract Address:", contractAddresses.AuthenticateAddress);
    console.log("AIService Contract Address:", contractAddresses.AIServiceAddress);
    res.json(contractAddresses);
    
}

module.exports.getAuthContractABI = (req, res) => {
    const filePath = path.join(__dirname, '../../blockchain/artifacts/contracts/Authentication.sol', 'Authentication.json');
    const contractABI = JSON.parse(fs.readFileSync(filePath));
    // Now you can use the contract addresses as needed
        res.json(contractABI.abi);

}

module.exports.getRequestServiceContractABI = (req, res) => {
    const filePath = path.join(__dirname, '../../blockchain/artifacts/contracts/RequestService.sol', 'RequestService.json');
    const contractABI = JSON.parse(fs.readFileSync(filePath));
    // Now you can use the contract addresses as needed
    res.json(contractABI.abi);

}

module.exports.getaiServiceContractABI = (req, res) => {
    const filePath = path.join(__dirname, '../../blockchain/artifacts/contracts/AIService.sol', 'AIService.json');
    const contractABI = JSON.parse(fs.readFileSync(filePath));
    // Now you can use the contract addresses as needed
    res.json(contractABI.abi);

}

module.exports.getLogin = (req, res) => {
    if (req.session.user) {
        console.log("Hello");
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
}

module.exports.getRequests = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
        const contractAddresses = JSON.parse(fs.readFileSync(filePath));
        const requestServiceAddress = contractAddresses.RequestServiceAddress;
        const filePath2 = path.join(__dirname, '../../blockchain/artifacts/contracts/RequestService.sol', 'RequestService.json');
        const requestServiceContractABI = JSON.parse(fs.readFileSync(filePath2));
        
        const contract = new web3.eth.Contract(requestServiceContractABI.abi, requestServiceAddress);
        const allRequests = await contract.methods.getAllRequests().call();
        console.log(allRequests);
        res.json({ status: 200, data: allRequests});


    }
    catch (error) {
        console.error(error);
        res.json({status : 500,error:error});
    }
};

module.exports.getServices = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
        const contractAddresses = JSON.parse(fs.readFileSync(filePath));
        const AIServiceAddress = contractAddresses.AIServiceAddress;
        const filePath2 = path.join(__dirname, '../../blockchain/artifacts/contracts/AIService.sol', 'AIService.json');
        const AIServiceContractABI = JSON.parse(fs.readFileSync(filePath2));

        const contract = new web3.eth.Contract(AIServiceContractABI.abi, AIServiceAddress);
        const allServices = await contract.methods.getAllServices().call();
        console.log(allServices);
        res.json({ status: 200, data: allServices });


    }
    catch (error) {
        console.error(error);
        res.json({ status: 500, error: error });
    }
};
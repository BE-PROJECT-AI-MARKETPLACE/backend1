const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config('../.env');
const fs = require('fs');
const path = require('path');



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

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config('../.env');
const fs = require('fs');
const path = require('path');
const { Web3 } = require('web3');
let provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
const { ethers, JsonRpcProvider, providers, Contract } = require("ethers");
const { type } = require('os');

let web3 = new Web3(provider);


module.exports.postLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const account = req.body.account;

        const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
        const contractAddresses = JSON.parse(fs.readFileSync(filePath));
        const AuthenticationAddress = contractAddresses.AuthenticateAddress;
        const filePath2 = path.join(__dirname, '../../blockchain/artifacts/contracts/Authentication.sol', 'Authentication.json');
        const AuthenticationContractABI = JSON.parse(fs.readFileSync(filePath2));
        const gas = 500000;
        const contract = new web3.eth.Contract(AuthenticationContractABI.abi, AuthenticationAddress);
        const message = await contract.methods.login(email, password).call({ from: account, gas });
        // console.log(message);
        const user = {
            email,
            account
        };
        if (message === "Incorrect Credentials") {
            res.json({ status: 400, message: "Invalid credentials" })
        }
        else {
            //make session 
            req.session.user = user;
            res.json({ status: 200, message: "Login Successful" });
        }

    }
    catch (error) {
        console.error(error);
        res.json({ status: 500, error: error });
    }
}

module.exports.getLogin = async (req, res) => {
    if (req.session.user) {
        res.json({ valid: true, user: req.session.user });
    }
    else {
        res.json({ valid: false });
    }
}

module.exports.logout = async (req, res) => {
    res.clearCookie('userId', { path: '/' });
    res.json({ status: 200, message: "Logout Sucessfull" });
}

module.exports.processRequest = async (req, res) => {
    const formData = req.body;
    // console.log(formData);
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
            // console.log(err);
        }
        else {
            // console.log('Mail Sent!!' + info.response);
        }
    });
    res.json({ success: true, message: 'Form data received successfully' });
};

module.exports.getContractAddress = (req, res) => {
    const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
    const contractAddresses = JSON.parse(fs.readFileSync(filePath));
    // Now you can use the contract addresses as needed
    // console.log("Authenticate Contract Address:", contractAddresses.AuthenticateAddress);
    // console.log("AIService Contract Address:", contractAddresses.AIServiceAddress);
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


module.exports.getRequests = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
        const contractAddresses = JSON.parse(fs.readFileSync(filePath));
        const requestServiceAddress = contractAddresses.RequestServiceAddress;
        const filePath2 = path.join(__dirname, '../../blockchain/artifacts/contracts/RequestService.sol', 'RequestService.json');
        const requestServiceContractABI = JSON.parse(fs.readFileSync(filePath2));

        const contract = new web3.eth.Contract(requestServiceContractABI.abi, requestServiceAddress);
        const allRequests = await contract.methods.getAllRequests().call();
        // console.log(allRequests);
        res.json({ status: 200, data: allRequests });


    }
    catch (error) {
        console.error(error);
        res.json({ status: 500, error: error });
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
        // console.log(allServices);
        res.json({ status: 200, data: allServices });


    }
    catch (error) {
        console.error(error);
        res.json({ status: 500, error: error });
    }
};


module.exports.getIndividualService = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
        const contractAddresses = JSON.parse(fs.readFileSync(filePath));
        const AIServiceAddress = contractAddresses.AIServiceAddress;
        const filePath2 = path.join(__dirname, '../../blockchain/artifacts/contracts/AIService.sol', 'AIService.json');
        const AIServiceContractABI = JSON.parse(fs.readFileSync(filePath2));

        const { id } = req.params; // Extract the ID from the request body
        // console.log("Received ID:", id);
        const contract = new web3.eth.Contract(AIServiceContractABI.abi, AIServiceAddress);
        const Service = await contract.methods.getService(id).call();
        // console.log(Service);
        res.json({ status: 200, data: Service });


    }
    catch (error) {
        console.error(error);
        res.json({ status: 500, error: error });
    }
};

module.exports.getUserDetails = async (req, res) => {
    try {
        //get user id from token   
        const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
        const contractAddresses = JSON.parse(fs.readFileSync(filePath));
        const AIServiceAddress = contractAddresses.AIServiceAddress;
        const filePath2 = path.join(__dirname, '../../blockchain/artifacts/contracts/AIService.sol', 'AIService.json');
        const AIServiceContractABI = JSON.parse(fs.readFileSync(filePath2));

        const AuthenticationAddress = contractAddresses.AuthenticateAddress;
        const filePath3 = path.join(__dirname, '../../blockchain/artifacts/contracts/Authentication.sol', 'Authentication.json');
        const AuthenticationContractABI = JSON.parse(fs.readFileSync(filePath3));

        const aiServiceContract = new web3.eth.Contract(AIServiceContractABI.abi, AIServiceAddress);

        const { id } = req.params; // Extract the ID from the request body
        // console.log("Received ID:", id);
        const contract = new web3.eth.Contract(AuthenticationContractABI.abi, AuthenticationAddress);
        const User = await contract.methods.getUserByID(id.toString().trim()).call();
        const userServicesBought = await aiServiceContract.methods.getUserServices().call({
            from: id.toString().trim(),
        });
        const ownerServices = await aiServiceContract.methods.getOwnersServices().call({
            from: id.toString().trim()
        });
        console.log(User);
        console.log(userServicesBought);
        console.log(ownerServices);
        res.json({ status: 200, data: { User, userServicesBought, ownerServices } });


    }
    catch (error) {
        console.error(error);
        res.json({ status: 500, error: error });
    }
}


module.exports.paymentMechanism = async (req, res) => {
    const filePath = path.join(__dirname, '../../blockchain/scripts', 'contract-address.json');
    const contractAddresses = JSON.parse(fs.readFileSync(filePath));
    const PaymentContractAddress = contractAddresses.PaymentContractAddress;
    const filePath2 = path.join(__dirname, '../../blockchain/artifacts/contracts/PaymentContract.sol', 'PaymentContract.json');
    const PaymentContractABI = JSON.parse(fs.readFileSync(filePath2));

    const AIServiceAddress = contractAddresses.AIServiceAddress;
    const filePath3 = path.join(__dirname, '../../blockchain/artifacts/contracts/AIService.sol', 'AIService.json');
    const AIServiceContractABI = JSON.parse(fs.readFileSync(filePath3));

    const aiServiceContract = new web3.eth.Contract(AIServiceContractABI.abi, AIServiceAddress);

    //fetching PaymentContract
    const PaymentContract = new web3.eth.Contract(PaymentContractABI.abi, PaymentContractAddress);

    const { amount, payer, service_name } = req.body;
    console.log("Service Name:", service_name);
    console.log("Payer:", payer);
    console.log("Amount", amount);
    try {
        const ownerAddress = await aiServiceContract.methods.getOwnerAddress(service_name).call();
        console.log("Owner Address:", ownerAddress);
        await PaymentContract.methods.pay(ownerAddress).send({
            from: payer,
            value: web3.utils.toWei(amount, 'ether'),
            gas: 500000

        });
        const bool = await aiServiceContract.methods.giveUserAccess(service_name).send({
            from: payer
        });
        if (bool) {
            const hash = await aiServiceContract.methods.getAddressByName(service_name).call({
                from: payer
            });
            console.log(hash);
            res.json({
                status: 200,
                message: "Payment Successful",
                data: hash,

            });
        } else {
            res.json({
                status: 500,
                message: "Payment Unsuccessful",
            })
        }

    }
    catch (err) {
        res.json({
            status: 500,
            message: "Payment Unsuccessful",
        })
        console.error(err);
    }




    // const { }
};
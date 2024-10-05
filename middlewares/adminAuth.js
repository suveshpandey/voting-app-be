const jwt = require('jsonwebtoken');
const JWT_SECRET = "suvesh298";
const {adminModel} = require('../models/model');

async function signUpAuth(req, res, next){
    const aadharNo = req.body.aadharNo;
    const password = req.body.password;

    const response = await adminModel.findOne({aadharNo});

    if(!response){
        next();
    }
    else{
        res.status(401).json({message: "Admin with this Aadhar-no is already present."});
    }
}
async function signInAuth(req, res, next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    
    if(decodedData){
        req.adminId = decodedData.id;
        next();
    }
    else{
        res.status(403).json({message: "You are not signed in."});
    }
}
module.exports = {
    signUpAuth: signUpAuth,
    signInAuth: signInAuth
}
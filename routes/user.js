const express = require('express');
const { userModel, voteModel} = require('../models/model');
const { signUpAuth, signInAuth } = require('../middlewares/userAuth');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middlewares/auth');
const JWT_SECRET = "suvesh298";

const Router = express.Router;
const userRouter = Router();

userRouter.post('/signup', signUpAuth, async (req, res)=>{
    const aadharNo = req.body.aadharNo;
    const password = req.body.password;
    try{
        await userModel.create({
            aadharNo,
            password,
            role: 'user'
        });
        res.status(201).json({message: "User successfully signed-up."})
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured while signing-up.",
            error: error.message
        })
    }
})
userRouter.post('/signin', async (req, res)=>{
    const aadharNo = req.body.aadharNo;
    const password = req.body.password;

    try{
        const user = await userModel.findOne({
            aadharNo,
            password,
            role: 'user'
        });
        if(user){
            const token = jwt.sign({id:user._id},JWT_SECRET);
            res.status(201).json({
                message: "User successfully signed-in.",
                token: token
            })
        }
        else{
            res.status(404).json({message: "Wrong credentials"})
        }
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured while signing-in.",
            error: error.message
        })
    }
})
userRouter.put('/change-password', authenticate, async (req, res)=>{
    const userId = req.userId;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword

    try{
        const user = await userModel.findById(userId);
        
        if(!user) res.status(400).json({message: "Wrong credentials."});
        user.password = newPassword;
        await user.save();
        res.status(201).json({message: "Password changed successfully."})
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured changing the password.",
            error: error.message
        })
    }
})
userRouter.post('/vote', authenticate, async (req, res)=>{
    const condidateId = req.body.condidateId;
    const userId = req.userId;

    try{
        const found = await voteModel.findOne({userId});
        if(! found){
            await voteModel.create({
                condidateId,
                userId
            })
            return res.status(201).json({message: "Voted successfully."})
        }
        else{
            return res.status(401).json({message : "You have already voted."});
        }
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured while voting.",
            error: error.message
        })
    }
})

module.exports = {
    userRouter: userRouter
}
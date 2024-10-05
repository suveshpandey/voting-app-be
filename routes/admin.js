const express = require('express');
const { adminModel, condidateModel, userModel } = require('../models/model');
const { signUpAuth, signInAuth } = require('../middlewares/adminAuth')
const { authenticate, isAdmin } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "suvesh298";

const Router = express.Router;
const adminRouter = Router();

adminRouter.post('/signup', signUpAuth, async (req, res)=>{
    const aadharNo = req.body.aadharNo;
    const password = req.body.password;
    try{
        await userModel.create({
            aadharNo,
            password,
            role: 'admin'  //explicitly set role as admin.
        });
        res.status(201).json({message: "Admin successfully signed-up."})
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured while signing-up.",
            error: error.message
        })
    }
})
adminRouter.post('/signin', async (req, res)=>{
    const aadharNo = req.body.aadharNo;
    const password = req.body.password;

    try{
        const admin = await userModel.findOne({
            aadharNo : aadharNo,
            password : password,
            role: 'admin'
        });
        if(admin){
            const token = jwt.sign({id : admin._id},JWT_SECRET);
            res.status(201).json({
                message: "Admin successfully signed-in.",
                token: token
            })
        }
        else{
            res.status(404).json({message: "Wrong credentials, or not an admin."})
        }
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured while signing-in.",
            error: error.message
        });
    }
});
adminRouter.post('/create-condidate', authenticate, isAdmin, async (req, res)=>{
    const name = req.body.name;
    const party = req.body.party;
    const creatorId = req.user._id;

    try{
        await condidateModel.create({
            name,
            party,
            creatorId,
            votes: 0
        })
        res.status(201).json({message: "Condidate is  added successfully."})
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured while adding condidate.",
            error: error.message
        })
    }
})
adminRouter.put('/update-condidate', signInAuth, async (req, res)=>{
    const condidateId = req.body.condidateId;
    const name = req.body.name;
    const party = req.body.party;
    const votes = req.body.votes;

    try{
        await condidateModel.updateOne({
            _id : condidateId
        },
    {
        name,
        party,
        votes
    })
        res.status(201).json({message: "Condidate is  updated successfully."})
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured while updating condidate.",
            error: error.message
        })
    }
})
adminRouter.delete('/delete-condidate', signInAuth, async (req, res)=>{
    const condidateId = req.body.condidateId;

    try{
        await condidateModel.deleteOne({
            _id : condidateId
        })
        res.status(200).json({message: "Condidate is  deleted successfully."})
    }
    catch(error){
        res.status(500).json({
            message: "Some error occured while updating condidate.",
            error: error.message
        })
    }
})

module.exports = {
    adminRouter: adminRouter
}
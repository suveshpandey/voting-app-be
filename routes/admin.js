const express = require('express');
const { adminModel, condidateModel } = require('../models/model');
const { signUpAuth, signInAuth } = require('../middlewares/adminAuth')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "suvesh298";

const Router = express.Router;

const adminRouter = Router();

adminRouter.post('/signup', signUpAuth, async (req, res)=>{
    const aadharNo = req.body.aadharNo;
    const password = req.body.password;
    try{
        await adminModel.create({
            aadharNo,
            password
        })
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
        const response = await adminModel.findOne({
            aadharNo,
            password
        })
        if(response){
            const token = jwt.sign({id:response._id},JWT_SECRET);
            // res.header.token = token;
            res.status(201).json({
                message: "Admin successfully signed-in.",
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
adminRouter.post('/create-condidate', signInAuth, async (req, res)=>{
    const name = req.body.name;
    const party = req.body.party;
    const votes = req.body.votes || 0;

    try{
        await condidateModel.create({
            name,
            party,
            votes
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
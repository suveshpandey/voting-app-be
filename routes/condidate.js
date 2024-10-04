const express = require('express');
const { condidateModel, voteModel } = require('../models/model');
const Router = express.Router;

const condidateRouter = Router();

condidateRouter.get('/condidates', async (req, res) => {
    try {
        // Fetch all candidates
        const condidates = await condidateModel.find({});

        // Fetch vote counts for each candidate
        const condidateVotes = await Promise.all(condidates.map(async (condidate) => {
            const voteCount = await voteModel.countDocuments({ condidateId: condidate._id });
            return {
                ...condidate._doc, // Spread the candidate details
                voteCount // Add the vote count to the candidate
            };
        }));

        // Sort candidates by vote count in descending order
        condidateVotes.sort((a, b) => b.voteCount - a.voteCount);

        // Return the sorted list
        res.status(201).json({ Condidates: condidateVotes });
    } catch (error) {
        res.status(500).json({
            message: "Some error occurred while fetching candidate details.",
            error: error.message
        });
    }
});

module.exports = {
    condidateRouter: condidateRouter
};

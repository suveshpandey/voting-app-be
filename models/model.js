const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

console.log("connected to db.");
mongoose.connect("mongodb+srv://adminSuvesh:suveshmongo298@cluster0.y0ux6.mongodb.net/voting-app-backend-2");

const adminSchema = new Schema ({
    aadharNo: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
const userSchema = new Schema ({
    aadharNo: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
const condidateSchema = new Schema ({
    name: {type: String, required: true},
    party: {type: String, required: true},
    creatorId: {type: String, required: true},
    votes: {type: Number}
})
const voteSchema = new Schema ({
    condidateId : ObjectId,
    userId : {type : ObjectId, unique : true}
})

const adminModel = mongoose.model('Admin', adminSchema);
const userModel = mongoose.model('User', userSchema);
const condidateModel = mongoose.model('Condidate', condidateSchema);
const voteModel = mongoose.model('Vote', voteSchema);

module.exports = {
    adminModel: adminModel,
    userModel: userModel,
    condidateModel: condidateModel,
    voteModel: voteModel
}
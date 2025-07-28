const express = require("express")
const authMiddlware = require("../middlewares/middleware")
const { Account } = require("../db/db")
const { default: mongoose } = require("mongoose")
const router = express.Router()


// FOr checking users balance
router.get("/balance", authMiddlware, async (req, res) => {
    const account = await Account.findOne({userId : req.userId})

    res.status(200).json({
        balance : account.balance
    })
})



// Transfer money 
// Both debit / credit should happen at one time


router.post("/transfer", authMiddlware ,async(req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    const {amount , to} = req.body

    const account = await Account.findOne({userId : req.userId}).session(session)
    if(!account || account.balance < amount){
        // abort the session
        await session.abortTransaction()
        return res.status(400).json({
            message : "insuficient balance"
        })
    }


    const toAccount = await Account.findOne({userId : to}).session(session)

    if(!toAccount){
        await session.abortTransaction()
        return res.status(400).json({
            message : "User account doesnot exist"
        })
    }


    // Performing the trasaction by Updating the value
    // Receiver =>  +amount              Sender =>   -amount

    await Account.updateOne({userId : req.userId}, {$inc : {balance : -amount}}).session(session)
    await Account.updateOne({userId : to}, {$inc : {balance : +amount}}).session(session)


    // commiting the transaction
    await session.commitTransaction()

    res.status(200).json({
        message : "Transaction successfull"
    })
})
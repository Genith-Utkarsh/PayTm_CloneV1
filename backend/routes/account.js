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
})
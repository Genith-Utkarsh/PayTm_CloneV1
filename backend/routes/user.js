const express = require("express")
const zod = require("zod")
const User = require("../db/db")
const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET
const router = express.Router()




router.post("/signup", async (req, res) => {

    const userInfo = req.body

    const schema = zod.object({
        username : zod.string(),
        password : zod.string(),
        firstName : zod.string(),
        lastName : zod.string(),
    })

    const responce = schema.safeParse(userInfo)

    // zod validation
    if(!responce){
        return res.send("Given inputs doesnot match correct format..")
    }

    // Checking if user exist or not in data base
    const userExists = await User.findOne({username})

    if(userExists){
        return res.status(409).send("User already exist ... Use different username..")
    }
    const {username} = req.body
    const payload = {username}
    const token = jwt.sign(payload, secret)

    try {
        await User.create(userInfo)

        res.status(200).json({
            msg : "User created successfully..",
            tokenId : token
        })
    } catch(err){
        console.log(err)
        res.status(501).send("Error creating user.. somthing is up with our server")
    }
})


module.exports = router
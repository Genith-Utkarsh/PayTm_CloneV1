const express = require("express");
const zod = require("zod");
const User = require("../db/db");
const jwt = require("jsonwebtoken");
const authMiddlware = require("../middlewares/middleware");
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET not defined");
const router = express.Router();

const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(body);

  // zod validation
  if (!success) {
    return res.status(400).json({ msg: "Invalid input format" });
  }

  // Checking if user exist or not in data base
  const user = await User.findOne({ username: body.username });

  if (user) {
    res.status(409).json({ msg: "User already exists" });
  }

  try {
    const newUser = await User.create(body);

    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, secret);

    res.status(200).json({
      msg: "User created successfully..",
      token : token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error while creating user" });
  }
});



router.post("/signin", async (req, res) => {
  const userBody = req.body;

  try {
    const user = await User.findOne({ username : userBody.username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.password !== userBody.password) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    const payload = { userId : user._id };
    const token = jwt.sign(payload, secret);

    res.status(200).json({
      message: "Sign in successful",
      tokenId: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error during sign in" });
  }
});


const updateBody =  zod.object({
  password : zod.string().optional() ,
  firstName : zod.string().optional(),
  lastName : zod.string().optional()
})

router.patch("/", authMiddlware, async (req, res) => {
  const {success} = updateBody.safeParse(req.body)
  if(!success){
    return res.status(400).json({ msg: "Invalid update payload" });
  }

   try {
      await User.updateOne({_id : req.userId}, req.body)
      res.status(200).json({
        msg : "success Updating the info.."
      })
   } catch(err){
    console.log(err)
    res.status(501).json({
      msg : "server error during updating info"
    })
   }
})



module.exports = router;

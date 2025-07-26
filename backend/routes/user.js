const express = require("express");
const zod = require("zod");
const User = require("../db/db");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
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
    return res.send("Given inputs doesnot match correct format..");
  }

  // Checking if user exist or not in data base
  const user = await User.findOne({ username: body.username });

  if (user._id) {
    return res
      .status(409)
      .send("User already exist ... Use different username..");
  }

  try {
    const newUser = await User.create(userInfo);

    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, secret);

    res.status(200).json({
      msg: "User created successfully..",
      token : token,
    });
  } catch (err) {
    console.log(err);
    res
      .status(501)
      .send("Error creating user.. somthing is up with our server");
  }
});



router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(411).send("User not found in our database");
    }

    if (user.password !== password) {
      return res.status(411).send("Wrong password");
    }

    const payload = { username };
    const token = jwt.sign(payload, secret);

    res.status(200).json({
      message: "Sign in successful",
      tokenId: token,
    });
  } catch (err) {
    console.log(err);
    res.status(501).send("Error while sign in..");
  }
});

module.exports = router;

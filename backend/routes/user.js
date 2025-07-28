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
    return res.status(400).json({ message: "Invalid input format" });
  }

  // Checking if user exist or not in data base
  const user = await User.findOne({ username: body.username });

  if (user) {
    res.status(409).json({ message: "User already exists" });
  }

  try {
    const newUser = await User.create(body);

    const userId = newUser._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 1000,
    });

    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, secret);

    res.status(200).json({
      message: "User created successfully..",
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error while creating user" });
  }
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const userBody = req.body;

  // zod validation for sign in
  const { success } = signinBody.safeParse(userBody);

  if (!success) {
    return res.status(411).json({
      message: "Wrong inputs",
    });
  }

  try {
    const user = await User.findOne({ username: userBody.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== userBody.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const payload = { userId: user._id };
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

// Updating ..

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.patch("/", authMiddlware, async (req, res) => {
  const parsed = updateBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid update payload" });
  }

  try {
    await User.updateOne({ _id: req.userId }, { $set: parsed.data });
    res.status(200).json({
      message: "success Updating the info..",
    });
  } catch (err) {
    console.log(err);
    res.status(501).json({
      message: "server error during updating info",
    });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || " ";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],

  });



  res.json({
    user : users.map(user => ({
        username : user.username,
        firstName : user.firstName,
        lastName : user.lastName,
        userId : user._id
    }))

  })

});



module.exports = router;

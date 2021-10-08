const express = require("express");

const router = express.Router();
const User = require("../models/user");

router.post("/auth/signin", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.json({ message: "please enter valid credentials", auth: false });
  }

  // const user=await User.findOne({email}).select('+passwordHash'); //use this for password field select value to be false ...password:{select:false}
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.json({ message: "invalid email or password", auth: false });
  } else {
    const sessUser = {
      id: user._id,
      email: user.email,
      userName: user.userName,
    };
    req.session.user = sessUser;
    return res.json({
      message: "successfuly logged in",
      auth: true,
      user: req.session.user,
    });
  }
});

router.post("/auth/signup", async (req, res, next) => {
  const { userName, email, password } = req.body;
  const newUser = await new User({ userName, email, password });
  const sessUser = {
    id: newUser._id,
    email: newUser.email,
    userName: newUser.userName,
  };
  req.session.user = sessUser;

  newUser
    .save()
    .then((result) => {
      res.json({
        message: "successfuly created ",
        auth: true,
        user: req.session.user,
      });
    })
    .catch((err) => {
      res.json({ message: "unable to create user", error: err, auth: false });
    });
});

router.get("/auth/hasSignedIn", async (req, res, next) => {
  if (req.session.user) {
    return res.json({
      auth: true,
      user: req.session.user,
      message: "you are signned in !",
    });
  }
  return res.json({
    auth: false,
    message: "you are not logged in !!",
  });
});

router.get("/auth/signout", async (req, res, next) => {
  await req.session.destroy();
  res.json({
    auth: false,
  });
});

module.exports = router;

require("dotenv").config();
const express = require("express");
const connect = require("../Model/db");
const cookieParser = require("cookie-parser");
const { json } = require("body-parser");
const verify = require("../Middleware/verify");
const handleError = require("../handleError");
const User = require("../Model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
const user_email_verify = require("./emailVerify");
const importContacts = require("./importContacts");
const { join } = require("path");
// const userRouter = require("../routes/userRoute");
// const tweetRouter = require("../routes/tweetRoute");
global.__upload = join(__dirname, "..");
const app = express();
connect(); // connect to db
function corsMiddleWare(req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://contact-form-bz3e.vercel.app"
  );
  res.removeHeader("X-powered-by");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  if (req.method == "OPTIONS") {
    res.status(200);
    res.end();
  } else {
    next();
  }
}
app.use(corsMiddleWare);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.get("/api/verifytoken", verify, (req, res) => {
  try {
    // console.log(req.rootUser);
    const user = req.rootUser.toObject();
    console.log(req.rootUser);
    // delete user.password;
    res.status(200).send({ user });
  } catch (err) {
    console.log(err);
    res.status(400).send(handleError(err));
  }
});
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properply" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (password.length < 5) {
      return res.status(422).json({ error: "Password is too short" });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: " user registerd successfully " });
  } catch (err) {
    res.status(400).send(handleError(err));
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "please fill the data properly" });
    }
    const userLogin = await User.findOne({ email: email });
    //   console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        // let token = await userLogin.generateAuthToken();
        let token = jwt.sign({ _id: userLogin._id }, process.env.SECRET_KEY);
        User.findOneAndUpdate(
          { email: email },
          {
            $push: {
              tokens: {
                token: token,
              },
            },
          },
          (err, data) => {
            if (err) {
              res.status(400).send(handleError(err));
              return;
            }
            res.cookie("jwt", token, {
              expires: new Date(Date.now() + 25892000000),
              httpOnly: true,
              sameSite: "none",
              secure: true,
            });
            let user = data.toObject();
            delete user.password;
            res.status(200).send({ user });
          }
        );
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(400).send(handleError(err));
  }
});
app.get("/api/logout", verify, async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    User.findOneAndUpdate(
      { _id: verifyToken._id, "tokens.token": token },
      {
        $pull: {
          tokens: {
            token: req.token,
          },
        },
      },
      (err) => {
        if (err) {
          res.status(400).send(handleError(err));
          return;
        }
        res.clearCookie("jwt");
        res.status(201).send({ message: "user Logout" });
      }
    );
  } catch (err) {
    res.status(400).send(handleError(err));
  }
});
app.get("/api/verifyemail/:mail", user_email_verify);
app.post("/api/import", verify, importContacts);
app.get("/api/contacts", verify, async (req, res) => {
  try {
    let limit = 10;
    let skip = 0;
    if (req.query.limit) {
      let l = Number.parseInt(req.query.limit);
      if (Number.isInteger(l)) {
        limit = l;
      }
    }
    if (req.query.skip) {
      let s = Number.parseInt(req.query.skip);
      if (Number.isInteger(s)) {
        skip = s;
      }
    }
    let items = await User.aggregate([
      { $match: { _id: req.rootID } },
      { $unwind: "$contacts" },
      { $sort: { date: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 0,
          email: 0,
          phone: 0,
          _id: 0,
          password: 0,
          tokens: 0,
          creadedAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);
    items = items.map((item) => item.contacts);
    res.status(200).send(items);
  } catch (err) {
    res.status(400).send(handleError(err));
  }
});
// app.use("/api/user", userRouter);
// app.use("/api/tweet", tweetRouter);
// app.use(express.static("./public"));
// app.get("/*", (req, res) => {
//   res.sendFile(path.resolve("./public/index.html"));
// });
app.listen(process.env.PORT || 5000, () => {
  console.log(`server listening to ${process.env.PORT || 5000}`);
});

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
function hashPassword(plainText) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainText, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
}
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "${VALUE} is already present"],
    },
    password: {
      type: String,
      message: () => `password is not valid`,
      required: [true, "password is required"],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  }
);
userSchema.pre("save", async function (next) {
  try {
    if (this.password.length < 6) {
      throw {
        errors: {
          password: {
            name: "ValidatorError",
            message:
              "password not strong enough.It must follow all the constraints",
            properties: {
              message:
                "password not strong enough.It must follow all the constraints",
              type: "size",
              path: "password",
            },
            kind: "size",
            path: "password",
          },
        },
        _message: "user validation failed",
        name: "ValidationError",
        message:
          "user validation failed: password: password not strong enough.It must follow all the constraints",
      };
    }
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});
// userSchema.methods.generateAuthToken = async function () {
//   try {
//     let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
//     this.tokens = this.tokens.concat({ token: token });
//     await this.save();
//     return token;
//   } catch (err) {
//     console.log(err);
//   }
// };
const User = mongoose.model("user", userSchema);
module.exports = User;

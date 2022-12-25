const util = require("util");
const multer = require("multer");
const { join } = require("path");
const maxSize = 2 * 1024 * 1024;
function generateName(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result + ".csv";
}
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__upload, "tmp"));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, generateName(8));
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");
module.exports = uploadFile;

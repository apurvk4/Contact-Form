const mongoose = require("mongoose");
const fileUpload = require("../Middleware/fileUpload");
const { parse } = require("csv-parse");
const util = require("util");
// const getStream = require("get-stream");
const fs = require("fs");
const User = require("../Model/userSchema");
const { join } = require("path");
const removeFile = util.promisify(fs.unlink);
function readCsv(fileName, read, close) {
  const filePath = join(__upload, "tmp", fileName);
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ delimiter: ",", columns: true }));
  parser.on("data", (row) => {
    read(row);
  });
  parser.on("end", () => {
    close(fileName);
  });
}

const importContacts = async (req, res) => {
  try {
    await fileUpload(req, res);
    if (typeof req.file == "undefined") {
      return res.status(400).send({ message: "Upload a file please!" });
    }
    const conn = mongoose.connection;
    var session = await conn.startSession();
    let fname = req.file.filename;
    await session.withTransaction(async () => {
      let values = [];
      readCsv(
        fname,
        async (data) => {
          await User.bulkWrite([
            {
              updateOne: {
                filter: { _id: req.rootID },
                update: {
                  $push: {
                    contacts: data,
                  },
                },
              },
            },
          ]);
        },
        async (name) => {
          res.status(200).send({
            message: "The following file was uploaded successfully: " + name,
          });
          const filePath = join(__upload, "tmp", name);
          await removeFile(filePath);
        }
      );
    });
  } catch (err) {
    console.log(err);
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File larger than 2MB cannot be uploaded!",
      });
    }
    res.status(500).send({
      message: `Unable to upload the file: ${req.file.filename}. ${err}`,
    });
    // await session.endSession();
  }
};
module.exports = importContacts;

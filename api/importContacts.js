const mongoose = require("mongoose");
const fileUpload = require("../Middleware/fileUpload");
const { parse } = require("csv-parse");
// const getStream = require("get-stream");
const fs = require("fs");
const User = require("../Model/userSchema");
// readCSVData = async (fileName) => {
//   console.log(filePath);
//   const parseStream = parse({ delimiter: "," });
//   const data = await getStream.array(
//     fs.createReadStream(filePath).pipe(parseStream)
//   );
//   return data.map((line) => line.join(",")).join("\n");
// };
function readCsv(fileName, read, close) {
  try {
    const filePath = __basedir + "/uploads/" + fileName;
    const parser = fs
      .createReadStream(filePath)
      .pipe(parse({ delimiter: ",", columns: true }));
    parser.on("data", (row) => {
      read(row);
    });
    parser.on("end", () => {
      close();
    });
  } catch (err) {
    console.log(err);
  }
}

const importContacts = async (req, res) => {
  try {
    await fileUpload(req, res);
    if (typeof req.file == "undefined") {
      return res.status(400).send({ message: "Upload a file please!" });
    }
    const conn = mongoose.connection;
    var session = await conn.startSession();
    await session.withTransaction(async () => {
      let values = [];
      readCsv(
        req.file.filename,
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
        () => {
          res.status(200).send({
            message:
              "The following file was uploaded successfully: " +
              req.file.filename,
          });
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

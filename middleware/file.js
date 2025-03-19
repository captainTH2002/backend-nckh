const multer = require("multer");
const upload = multer({ dest: "public/files/" });
const fs = require("fs");

const multipleUploads = upload.fields([
  { name: "file", maxCount: 10 },
  { name: "image", maxCount: 10 },
]);

const uploadFileExcel = upload.single("file")

const checkFileExcel = (req, res, next) => {
  const file = req.file
  
  if (file) {
    const addTail = file.destination.concat("", file.originalname);
    fs.rename(file.path, addTail, (err) => {
      if (err) next(err);
      console.log("Uploaded field successfully!");
    });
    req.url = addTail
   
  }
  next()
}

const checkMultipleFile = (req, res, next) => {
  const files = req.files;
  const fields = ["file", "image"];

  if (!files) {
    console.log("file not change!");
  } else {
    fields.map((field) => {
      req.body[field] = [];
      if (files[field]) {
        files[field].map((file) => {
          const addTail = file.destination.concat("", file.originalname);
          req.body[field] = req.body[field].concat(
            addTail
              .split("/")
              .slice(1)
              .join("/")
          );
          fs.rename(file.path, addTail, (err) => {
            if (err) next(err);
            console.log("Uploaded field successfully!");
          });
        });
      }
    });
  }
  next();
};

module.exports = {
  multipleUploads,
  checkMultipleFile,
  uploadFileExcel,
  checkFileExcel
};

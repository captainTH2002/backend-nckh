const fs = require("fs");

exports.getDir = ({ dir }) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

exports.removeDir = ({ dir }) => {
  //fs.rmSync(dir, { recursive: true, force: true });
  fs.unlink(dir, (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

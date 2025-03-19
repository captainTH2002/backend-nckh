var nodemailer = require("nodemailer");

const options = {
  service: "gmail",
  auth: {
    user: "nodejs.nkt@gmail.com",
    pass: "",
  },
};

const Main = (token, targetMail) => {
  var transporter = nodemailer.createTransport(options);
  transporter.verify(async (error) => {
    if (error) console.log(error);
    else {
      console.log("connected successfully!");
      var mail = {
        from: "nodejs.nkt@gmail.com",
        to: targetMail,
        subject: "Verify Login",
        text: `Verify Token: ${token}`,
      };
      transporter.sendMail(mail, (error, info) => {
        if (error) console.log(error);
        else console.log("Email sent: " + info.response);
      });
    }
  });
};

module.exports = Main;

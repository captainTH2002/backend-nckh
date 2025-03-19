const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pagination = require("./middleware/pagination");
const pageNotfound = require("./helper/pageNotfound");
const { api } = require("./config");
const db = require("./config/connectDB")
const route = require("./routes");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(pagination);

//config cors
var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  exposedHeaders: "Content-Range",
};
app.use(cors(corsOptions));

//connect db
db.connect()

const checkHealth = (req, res) => {
  res.send("SERVER IS RUNNING...");
};
app.get("/", checkHealth);
route(app);

app.use("*", pageNotfound);

const PORT = api.port;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`app listen at ${PORT}`);
});

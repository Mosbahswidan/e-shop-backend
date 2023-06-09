const path = require("path");
const express = require("express");
const cors = require('cors');
const compression = require('compression');
const dotenv = require("dotenv");
const morgan = require("morgan");
const dataBaseConnection = require("./config/database");
const apiError = require("./utils/apiError");
const globalError = require("./mddlewares/errorMiddleware");
const mountRoutes=require("./routes/index");
const {WebhookCheckout}=require("./services/oderServices")

dotenv.config({ path: "config.env" });

//db connect
dataBaseConnection();

const app = express();
//cors and compressionk
app.use(cors());
app.use(compression());
app.options("*",cors());

//checkout webhook
 app.post("/webhook-checkout",express.raw({type: 'application/json'}),WebhookCheckout);


app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount router
mountRoutes(app);
app.all("*", (req, res, next) => {
  // eslint-disable-next-line new-cap
  next(new apiError(`can not find this route:${req.originalUrl} `, 400));
});

//global error handling middlware in express
app.use(globalError);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listening to http://localhost:${port}/`);
});
//handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`Unhandeld Rejection error: ${err}`);
  server.close(() => {
    console.log(`server closed`);
    process.exit(1);
  });
});

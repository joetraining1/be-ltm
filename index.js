const express = require("express");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const FileUpload = require("express-fileupload");
const { rateLimiterMiddleware } = require("./utils/RateLimiter");
const { options } = require("./utils/SwaggerOptions");

// const { init } = require('./config/db')

require("dotenv").config();
const PORT = 3030;

const app = express();
const specs = swaggerJSdoc(options);

// init()
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://192.168.100.11:5173"],
  })
);
app.use(FileUpload());
app.use(express.static("public"));
app.use(rateLimiterMiddleware);

const { JWTController } = require("./controllers/JWTCon");
const { HomeController } = require("./controllers/HomeCon");

const typeRouter = require("./routes/Type");
const ctgRouter = require("./routes/Categories");
const paymentRouter = require("./routes/Payment");
const statusRouter = require("./routes/Status");
const bankRouter = require("./routes/Bank");
const productRouter = require("./routes/Product");
const userRouter = require("./routes/User");
const accountRouter = require("./routes/Account");
const cartRouter = require("./routes/Cart");
const cartDetailRouter = require("./routes/CartDetail");
const orderRouter = require("./routes/Order");
const { ProductController } = require("./controllers/ProductCon");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));
app.use(
  "/type",
  JWTController.verifyAccessToken.bind(JWTController),
  typeRouter
);
app.use("/ctg", JWTController.verifyAccessToken.bind(JWTController), ctgRouter);
app.use(
  "/payment",
  JWTController.verifyAccessToken.bind(JWTController),
  paymentRouter
);
app.use(
  "/status",
  JWTController.verifyAccessToken.bind(JWTController),
  statusRouter
);
app.use(
  "/bank",
  JWTController.verifyAccessToken.bind(JWTController),
  bankRouter
);
app.use(
  "/product",
  JWTController.verifyAccessToken.bind(JWTController),
  productRouter
);
app.use(
  "/user",
  JWTController.verifyAccessToken.bind(JWTController),
  userRouter
);
app.use(
  "/account",
  JWTController.verifyAccessToken.bind(JWTController),
  accountRouter
);
app.use(
  "/cart",
  JWTController.verifyAccessToken.bind(JWTController),
  cartRouter
);
app.use(
  "/cart_details",
  JWTController.verifyAccessToken.bind(JWTController),
  cartDetailRouter
);
app.use(
  "/order",
  JWTController.verifyAccessToken.bind(JWTController),
  orderRouter
);

app.post("/register", HomeController.register);
app.post("/login", HomeController.login);
app.get("/newAccess", JWTController.grantNewAccessToken.bind(JWTController));
app.get("/showcase", ProductController.showcase);
app.get("/showcase/:ctg_id", ProductController.showcaseById);
app.get("/display", ProductController.display);
app.post("/search", ProductController.searchProduct);

app.get("/", (req, res) => {
  res.send({ message: "You're connected to this api." });
});

app.listen(PORT, () => {
  console.log("Server up and running on: ".concat(PORT));
});

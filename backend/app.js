import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";

// importing the routers
import staticRouter from "./routes/staticRouter.js";
import userRouter from "./routes/userRouter.js";
import menuRouter from "./routes/menuRouter.js";
import myItemsRouter from "./routes/myItemsRouter.js";
import editItemRouter from "./routes/editItemRouter.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import foodItemsRouter from "./routes/fooditemsRouter.js";

// importing the middleware
import { checkForAuthentication, restrictTo } from "./middleware/auth.js";

const app = express();

// middleware setup
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: `${process.env.FRONTEND_URL}`, credentials: true }));

// rate limiter middleware setup
const rateLimiterMiddleware = rateLimiter({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 40, // each ip can make 40 requests per a window time
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(rateLimiterMiddleware);

// public routes
app.use("/", staticRouter);
app.use("/menu", menuRouter);
app.get("/health", (req, res) => {
  return res.json({ msg: "Server is healthy..!!" });
}); // health check endpoint

// protected routes
app.use("/user", checkForAuthentication, restrictTo("owner"), userRouter);
app.use(
  "/fooditems",
  checkForAuthentication,
  restrictTo("owner"),
  foodItemsRouter,
);
app.use("/myItems", checkForAuthentication, myItemsRouter);
app.use("/editItem", checkForAuthentication, editItemRouter);
app.use("/api", checkForAuthentication, paymentRoutes);

// global error handeler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;

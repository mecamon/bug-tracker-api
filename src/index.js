import express from "express";
import authRouter from "./controllers/auth-controller"
import companiesRouter from "./controllers/companies-controller"
import supervisorRouter from "./controllers/supervisor-controller"
import userRouter from "./controllers/user-controller"
import techRouter from "./controllers/tech-controller"
import db from './Data/db-connection'


const app = express();
const port = process.env.PORT || 7000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/supervisor", supervisorRouter);
app.use("/api/user", userRouter);
app.use("/api/tech", techRouter);



app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
  db();
});

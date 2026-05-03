import dotenv from 'dotenv';
import express from 'express';
import clientRoute from './routes/index.route.js';
import webRoute from "./routes/web.route.js";
import { connectDb } from './configs/database.config.js';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './configs/databaseORM.config.js';
import chalk, { Chalk } from "chalk";
export const forceColor = new Chalk({ level: 3 }); 
dotenv.config();

const app = express();

// static files
app.use(express.static("src/public"));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// view engine
app.set("view engine", "pug");
app.set("views", "./src/views");

// Database not useing ORM
connectDb();
//Database using ORM 
connectDatabase();

// routes
app.use('/api/client', clientRoute);
app.use('/', webRoute);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
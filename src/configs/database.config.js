import mysql from "mysql2/promise";

let db;

export const connectDb = async () => {
  try {

    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log("MySQL connected!");

  } catch (error) {

    console.log("MySQL not ready, retrying...");
    setTimeout(connectDb, 3000);

  }
};

export { db };
import { Sequelize } from "sequelize";
import { forceColor } from "../index.js";

export const sequelize = new Sequelize(
  "security",
  "root",
  "root",
  {
    host: "mysql",
    dialect: "mysql",
    port: 3306,
    logging: (msg) => {
      console.log(forceColor.cyan("[SQL]"), forceColor.yellow(msg));
    }
  }
);

export const connectDatabase = async (
  retries = 10,
  delay = 5000
) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      return;
    } catch (error) {
      console.error(
        `Connect fail lần ${i}/${retries}`
      );

      if (i === retries) {
        console.error("Hết số lần reconnect.");
        console.error(error);
        process.exit(1);
      }

      console.log(`Thử lại sau ${delay / 1000}s...`);

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
};
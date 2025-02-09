import { Sequelize } from "sequelize";
import "dotenv/config";
import config from "../../config/env/index.js";
import { remarks } from "../../modules/remarks/remarks.model.js";

export const db = new Sequelize("rmsDb", "root", "", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

console.log(`host:${config.mysql.host},port:${config.mysql.port}`);

export const dbConnect = async () => {
  try {
    await db.authenticate();
    remarks.sync();
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// export const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// });

// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to MySQL database');
// });

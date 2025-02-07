//import mysql from 'mysql2';
import { Sequelize } from 'sequelize';
import dotenv from dotenv;
dotenv.config();

export const db = new Sequelize(process.env.DB_DATABASE,process.env.DB_USER,process.env.DB_PASSWORD,{
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.PORT,
})


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


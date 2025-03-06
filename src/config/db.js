import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});




pool.getConnection((err, connection) => {
  if (err) {
    console.log("USUARIO: ", process.env.DB_USER);
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados MySQL!");
    connection.release();
  }
});


export default pool;

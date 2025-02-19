import express, { request } from "express";
import pool from "./config/db.js";
import routes from "./routes/routes.js"


const app = express();
app.use(express.json());
routes(app);


const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    email VARCHAR (100) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(createUsersTable, (err, results) => {
    if (err) console.error("Erro ao criar a tabela users:", err);
    else console.log("Tabela users verificada/criada com sucesso!");
});



app.listen(3000, () => {
    console.log("Servidor inicado...");
});


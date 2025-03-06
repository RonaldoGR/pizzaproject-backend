import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routes from "./routes/routes.js"

const app = express();
app.use(express.json());
app.use(cors());
routes(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Servidor inicado...");
});


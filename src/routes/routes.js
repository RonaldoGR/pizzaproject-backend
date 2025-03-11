import express from "express";
import { listarUsuario, inserirUsuario, deletarUsuario, verificarEmail, testeJwt } from "../controllers/userControllers.js";
import { authenticateToken } from "../middlewares/middlewares.js";



 const routes = (app) => {
    app.use(express.json());
    app.get("/", (req, res) => {
        res.status(200).send(`Página inicial`);
    });
    
    app.get("/login", (req, res) => {
        res.status(200).send("Rota de login");
    });

    app.get("/users/:id", listarUsuario);
    app.post("/signup", inserirUsuario);   
    app.post("/login", verificarEmail);
    app.get("/testejwt",authenticateToken, testeJwt);
    app.delete("/users/:id", deletarUsuario);    
    
    app.get("/pedidos", (req, res) => {
        res.status(200).json({ message: "Rota de pedidos" });
    })
}

export default routes;
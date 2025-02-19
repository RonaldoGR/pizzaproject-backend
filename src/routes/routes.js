import express from "express";
import pool from "../config/db.js";

 const routes = (app) => {
    app.use(express.json());
    app.get("/", (req, res) => {
        res.status(200).send(`Página inicial`);
    });
    
    app.get("/login", (req, res) => {
        res.status(200).send("Rota de login");
        console.log('ok')
    });
    
    app.post("/login",  (req, res) => {
    
        const { name, email, password } = req.body;
        const insertUser = `
            INSERT INTO users (name, email, password)
            VALUES (?, ? , ?);
        `
        const createUser = pool.query(insertUser, [name, email, password], (err, results) => {
            if (err) {
                console.error("Erro ao inserir usuário teste na tabela users:", err);
                return res.status(500).json({ message: "Erro ao cadastrar usuário" });
            }
            console.log("Usuário cadastrado.");
            return res.status(201).json({ message:"Usuário cadastrado!"});
        });
        return createUser; 
    });    
    
    
    
    
    app.get("/pedidos", (req, res) => {
        res.status(200).json({ message: "Rota de pedidos" });
    })
}

export default routes;
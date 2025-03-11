import dotenv from "dotenv"
dotenv.config();

import { user,  insertUserOnDB, deleteUserOnDB, getUserByEmail } from "../models/userModels.js";
import { generateAuthenticateToken, JWT_SIGNIN_KEY } from "../middlewares/middlewares.js";
import jwt from 'jsonwebtoken';
import testeRedis from "../config/redis.js";



export async function listarUsuario(req, res) {
    try {
        const id = req.params.id;
        const resultado = await user(id);
        res.status(200).json(resultado); 
    } catch (error) {
        console.error(error);
    }
};


export async function inserirUsuario (req, res) {
    try {
        const { name, email, password } = req.body;
        const resultado = await insertUserOnDB(name, email, password);

        if (resultado.message === "E-mail já cadastrado, por favor utilize outro.") {
            return res.status(409).json({ error: resultado.message });
        }

        res.status(201).json(resultado);
    } catch (error) {
        console.error("Erro inesperado ao cadastrar usuário:", error);
        return res.status(500).json({ error: "Erro interno ao cadastrar usuário" });
    }
};

export async function deletarUsuario (req, res) {
    try {
        const id = req.params.id;
        const resultado = await deleteUserOnDB(id);
        res.status(200).json(resultado); 
    } catch (error) {
        console.error(error);
        res.status(404).json("Usuário não encontrado");
    }
};

export async function verificarEmail(req, res) {
   
   try {
        const { email, password } = req.body; 

        
        const resultado = await getUserByEmail( email, password);
        
        if (!resultado || resultado.message == "E-mail incorreto ou não cadastrado") {
            return res.status(401).json("E-mail incorreto ou não cadastrado");
        }
        
        if (resultado.message === "Senha do usuário incorreta.") {
            return res.status(401).json({ error: "Senha incorreta" });
        }
   
        const user = { name: resultado.name,  id: resultado.id, email: resultado.email };

        const acessToken = generateAuthenticateToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);

        testeRedis(refreshToken);
        res.status(200).json({ acessToken: acessToken, refreshToken: refreshToken });
   } catch (error) {
        console.error(error);
        res.status(500).json('Erro intero ao tentar realizar login');
   }
};



export async function testeJwt (req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token =  authHeader && authHeader.split(" ")[1];
        const decoded = jwt.decode(token);
        const userName = decoded.name;
        return res.json(`Nome de usuário: ${userName} `);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno ao processar requisição" });
    }
}


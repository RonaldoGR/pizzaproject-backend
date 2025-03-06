import dotenv from "dotenv"
dotenv.config();

import { user,  insertUserOnDB, deleteUserOnDB, getUserByEmail } from "../models/userModels.js";
import { generateAuthenticateToken } from "../middlewares/middlewares.js";
import jwt from 'jsonwebtoken';



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
        const user = { email: email, password: password };
        const acessToken = generateAuthenticateToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
        const resultado = await getUserByEmail( email, password);

        if (resultado.message == "E-mail incorreto ou não cadastrado") {
            return res.status(401).json("E-mail incorreto ou não cadastrado");
        }

        if (resultado.message === "Senha do usuário incorreta.") {
            return res.status(401).json({ error: "Senha incorreta" });
        }

        res.status(200).json({ acessToken: acessToken, refreshToken: refreshToken });
   } catch (error) {
        console.error(error)
        res.status(500).json('Erro intero ao tentar realizar login');
   }
};


export async function testejwt (req, res) {
    try {
        return res.json(req.user.email)
        
    } catch (error) {
        console.error(error);
        res.status(500);
    }
}
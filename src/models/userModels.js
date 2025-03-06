import pool from "../config/db.js";
import bcrypt from "bcryptjs";



const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    email VARCHAR (100) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createUsersT = async () => {
    try {
       const [results] = await pool.query(createUsersTable);
        console.log("Tabela users verificada/criada com sucesso!");
    } catch (error) {
        console.error("Erro ao criar a tabela users.");
        throw new Error("Erro ao criar a tabela users.")
    }
}
createUsersT();


const selectUser = ` SELECT name, email FROM users
WHERE id = ?
`
const insertUser = ` INSERT INTO users (name, email, password)
            VALUES (?, ? , ?);`

const deleteUser = `DELETE FROM users WHERE id = ?;`
const userEmail =`SELECT * FROM users WHERE  email = ?;`;
const verifyEmail = `SELECT email FROM users WHERE email = ?`; 
const selectId = `SELECT id FROM users WHERE id = ?`;




export  async function user(id) {
    try {
        const [ results ] = await pool.query(selectUser, [id]);
        if (results.length === 0) {
            console.log("Usuário não encontrado.");
            return { message: "Usuário não encontrado." };
        }
        console.log("Usuário encontrado!");
        return results[0];
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao buscar usuário.");
        
    }

}




export async function insertUserOnDB(userName, userEmail, userPassword) {
    try {

        const [ resultado ] = await pool.query(verifyEmail, [userEmail]);

        if(resultado.length) {
            console.log("E-mail já cadastrado no banco de dados");
            return { message: "E-mail já cadastrado, por favor utilize outro." }
        }


            let hashedPassword = await bcrypt.hash(userPassword, 8);
            const [results] = await pool.query(insertUser, [userName, userEmail, hashedPassword]);

            
            console.log("Usuário cadastrado com sucesso!");
            return { message: "Usuário cadastrado com sucesso!" };
        } catch (error) {
            console.error("Erro ao inserir usuário na tabela users:", error);
            throw new Error("Erro ao cadastrar usuário");
    }};
   
 

export async function deleteUserOnDB (id) {
    
    try {
        const [ results ] = await pool.query(selectId, [id]);
        const userId = results.length;
        if (!userId) {
            console.log("Usuário não encontrado.");
            return { message: "Usuário não encontrado." };
        }
        const [ delUser ] = await pool.query(deleteUser, [id]);
        console.log("Usuário deletado.");
        return { message: "Usuário deletado com sucesso!" };

        
    } catch (error) {
        console.error("Erro ao verificar usuário.");
        return { message: "Usuário não existe." }
        
    }
};




export const getUserByEmail = async ( email, userPassword) => {
    
    try {
        const [ results ] = await pool.query(userEmail, [email]);
        if (results.length === 0) {
            console.log("E-mail incorreto ou não cadastrado");
            return { message: "E-mail incorreto ou não cadastrado" };
        }

        const {  password: hashedPassword } = results[0]


        const matchPassword = await bcrypt.compare(userPassword, hashedPassword);

        if (!matchPassword) {
            console.error("Senha do usuário incorreta.");
            return { message: "Senha do usuário incorreta." };
        }

        return { message: "Login realizado com sucesso" };
       
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao realizar login.");
        
    }

};

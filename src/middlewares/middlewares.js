import jwt from "jsonwebtoken";



export const JWT_SIGNIN_KEY = process.env.SECRET_KEY;
if (!JWT_SIGNIN_KEY) {
    throw new Error("Chave de autenticação não foi definida");
}



export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token =  authHeader && authHeader.split(" ")[1];
    if(!token) {
       return res.status(401).json({ error: "Token não fornecido" });
    }
    try {
       const user = jwt.verify(token, JWT_SIGNIN_KEY)
       req.user = user
       next(); 
    } catch (error) {
        return res.status(403).json({ error: "Token inválido ou expirado." });
    }
};

export const generateAuthenticateToken = (user) => {
    return  jwt.sign(user, JWT_SIGNIN_KEY, { expiresIn: '600s' });
};



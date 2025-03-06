import jwt from "jsonwebtoken";


export const JWT_SIGNIN_KEY = process.env.SECRET_KEY;
if (!JWT_SIGNIN_KEY) {
    throw new Error("Chave de autenticação não foi definida");
}



export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token =  authHeader.split(" ")[1];
    if(!authHeader) {
       return res.send("Não autenticado").sendStatus(401);
    }
    try {
        jwt.verify(token, JWT_SIGNIN_KEY, (err, user) => {
            if(err) {
                res.status(403);
                throw new Error("Erro na autenticação.");
            }
            req.user = user;
            next(); 
        });
    } catch (error) {
        res.status(500);
        throw new Error("Erro interno no servidor."); 
    }
};

export const generateAuthenticateToken = (user) => {
    return  jwt.sign(user, JWT_SIGNIN_KEY, { expiresIn: '15s' });
};
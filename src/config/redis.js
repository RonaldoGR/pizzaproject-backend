import { createClient } from "redis";


export default async function testeRedis(token) {
    const redisClient = createClient();
    redisClient.on('error', (err) => console.error('Erro no Redis:', err));
    await redisClient.connect();
    console.log("Redis conectado!");
    const resulToken = await redisClient.set("token", token);
    console.log("RESULTADO: ", resulToken);
    
} 
  

import dotenv from 'dotenv';  
import mysql from 'mysql2/promise'; 


const result = dotenv.config();
if (result.error) {
    throw result.error;  // Caso haja algum erro ao carregar o arquivo .env
}
const db = mysql.createPool({
    host: process.env.thehost, 
    user: process.env.usuario || 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: Number(process.env.PORT) || 3306
});


export default db;

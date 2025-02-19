import express from 'express';  
import router from './routes/routes';  
import bodyParser from 'body-parser';  
import cors from 'cors';
const app = express();
import cookieParser from 'cookie-parser';
import { initializeRedis } from './redis/redis-controllers';
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:8080', 
    credentials:true,
  }));
app.use(router);

initializeRedis();

const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});

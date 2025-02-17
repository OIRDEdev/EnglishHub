import { createClient } from "redis";

const  redisClient = createClient({url: 'redis://localhost:6379'});
redisClient.on('error', (err) =>{
    console.log('Erro no cliente redis', err);
});


const initializeRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Cliente Redis conectado.');
    } catch (err) {
        console.error('Erro ao conectar ao Redis:', err);
        process.exit(1); 
    }
};

//initializeRedis();

export const setValue = async (key: string, value: string): Promise<void> =>{
    await redisClient.set(key, value);
};

export const getValue = async (key: string): Promise<string | null> =>{
    return redisClient.get(key);
};

export const checkRedisHealth = async (): Promise<boolean> => {
    try{
        await redisClient.set('health', 'ok');

        const reply = await redisClient.get('health');
        return reply === 'ok';

    }   catch(error){
        console.log("erro na função health do redis, cheack false");
        return false
    }
}
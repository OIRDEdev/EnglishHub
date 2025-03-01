import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getHistoria } from '../Models/tablehistoria/historias';
import { getValue, setValue } from '../redis/redis-controllers';
import { gethistoriaData } from '../Models/tablehistoria/historias';
const GetHistoria: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;
    /*
    const { user } = req;
    
    if (!user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
    } 
    */

    if (typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const redisKey = `historia_${id}`;
        const cachedHistoria = await getValue(redisKey);

        if (cachedHistoria) {
            res.json(cachedHistoria);
        } else {
            const historia = await getHistoria(id);
            if (!historia) {
                res.status(404).json({ error: "Historia não encontrada: error função getHistoria" });
                return;
            }
            await setValue(redisKey, historia);
            res.json(historia);
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const GetHistoriaData = async (req: Request, res: Response) => {
    const data = await gethistoriaData();
    res.json(data);
};

export { GetHistoria };
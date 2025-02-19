import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getHistoria } from '../Models/tablehistoria/historias';
import { getValue, setValue } from '../redis/redis-controllers';
import { gethistoriaData } from '../Models/tablehistoria/historias';
const GetHistoria: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { title, id } = req.params;
    const { user } = req;

    if (!user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
    }

    try {
        const redisKey = `historia_${title}_${id}`;
        const cachedHistoria = await getValue(redisKey);

        if (cachedHistoria) {
            res.json(cachedHistoria);
        } else {
            const historia = await getHistoria(title, id);
            await setValue(redisKey, historia);
            res.json(historia);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a história' });
    }
}

export const GetHistoriaData = async (req: Request, res: Response) => {
    const data = await gethistoriaData();
    res.json(data);
};

export { GetHistoria };
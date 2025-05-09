import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getValue, setValue } from '../redis/redis-controllers';
import { gethistoriaData } from '../Models/tablehistoria/historias';
import Fetchhistory  from '../service/DatabaseObject'


const GetHistoria: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;
    
    if (typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    try {
        const redisKey = `history_${id}`;
        const audioKey = `audio_${id}`;
        
        const [cachedHistoria, cachedAudio] = await Promise.all([
            getValue(redisKey),
            getValue(audioKey)
        ]);

        if (cachedHistoria && cachedAudio) {
            res.json({
                historia: JSON.parse(cachedHistoria),
                audio: {
                    contentType: "audio/mp3",
                    data: cachedAudio 
                }
            });
        } else {
            let audiopath = 'stories/audio/';
            let historypath = 'stories/content/';
            const fileKey = redisKey + ".json";
            
            const historiaPromise = cachedHistoria ? 
                Promise.resolve(JSON.parse(cachedHistoria)) : 
                Fetchhistory(historypath + fileKey, false);
                
            const audioPromise = cachedAudio ? 
                Promise.resolve(cachedAudio) : 
                Fetchhistory(audiopath + redisKey + '.mp3', true);
            
            const [historia, audio] = await Promise.all([historiaPromise, audioPromise]);
            
            if (!historia) {
                res.status(404).json({ error: "History not found: error in function getHistoria" });
                return;
            }
            
            if (!cachedHistoria) {
                await setValue(redisKey, JSON.stringify(historia));
            }
            
            if (!cachedAudio) {
                const audioBase64 = audio.toString('base64');
                await setValue(audioKey, audioBase64);
            }
            
            res.json({
                historia, 
                audio: {
                    contentType: "audio/mp3", 
                    data: audio.toString('base64')
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const GetHistoriaData = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }
    
    const { userid } = req.user;
    
    if (!userid) {
        res.status(400).json({ error: "User ID is required and must be a number." });
        return;
    }

    const data = await gethistoriaData();
    res.json(data);
};

export { GetHistoria };
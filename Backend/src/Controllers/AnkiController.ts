import { Request, Response } from 'express';
import { getAnkiSentences, updateCardReview, addSentences } from '../Models/ankiDB/ankiDB';

export const GetAnkiSentences = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        
        const { userid } = req.user;
        
        if (!userid) {
            res.status(400).json({ error: "User ID is required and must be a number." });
            return;
        }
        const sentences = await getAnkiSentences(userid);
        res.json(sentences);
    } catch (error) {
        console.error("Error in GetAnkiSentences controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateCard = async (req: Request, res: Response): Promise<void> => {
    const { sentence, isGood} = req.body;  

    if (!sentence|| isGood === undefined) {
        res.status(400).json({ error: "Card ID and 'Good/Hard' rating are required." });
        return;
    }

    try {
        const result = await updateCardReview(sentence, isGood);  
        res.json(result);  
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update card review." });
    }
}

export const addsentencescontroller = async (req: Request, res: Response): Promise<boolean| void> => {
    if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }
    
    const { userid } = req.user;

    const { sentence, bookid } = req.body;
    
    try {
        const result: boolean = await addSentences(userid, sentence, bookid);
        if(result){
            return true;
        }
    }catch(error){
        console.error("error no controller ankicontroller funcão addsentence");
    }
    return false;
}


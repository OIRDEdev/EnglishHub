import db from "../Database";
import { RowDataPacket } from "mysql2";

interface Sentences_db extends RowDataPacket {
    id_card: number;
    expression: string;
    learning_rating: number;
    created_at: string;
    book_id: number;
    title: string;
    cards_count_in_book: number;
};
interface Card_update extends RowDataPacket{
    user_id: number;
    id_card: number;
    interval_days: number;
    ease_factor: number;
};

function validateSentence(sentence: string): boolean {
    if (!sentence || typeof sentence !== 'string' || sentence.length > 500) {
      return false;
    }
    return true;
}

function formatDateForSQL(date: Date): string{
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, '0'); 
    const day: string = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
  


async function updateCardReview(sentence: string, isGood: boolean) {
    if (!validateSentence(sentence)) {
        throw new Error("Formato invalido");
    }
    
    try{
        await db.beginTransaction();
        const querySelect = `
        SELECT id_card, user_id, interval_days, ease_factor
        FROM Anki_Cards 
        WHERE word_or_expression = ? `;
    
        const [rows]: any = await db.query<Card_update[]>(querySelect, [sentence]);
        if (rows.length === 0) throw new Error("Card not found");
    
        let { user_id, id_card, interval_days, ease_factor } = rows[0];
    
        if (isGood) {
            interval_days = Math.round(interval_days * ease_factor);
            ease_factor += 0.05; 
        } else {
            if(interval_days <= 8){
                interval_days = Math.round(interval_days / 2); 
                ease_factor = 2.3; 
            }else{
                interval_days = Math.round(interval_days / 3); 
                ease_factor = 2.3;
            }
            }
    
      
        const queryUpdate = `
            UPDATE Anki_Cards 
            SET interval_days = ?, ease_factor = ?, review_date = CURDATE()
            WHERE id_card = ? AND user_id = ?`;
    
        await db.query(queryUpdate, [interval_days, ease_factor, id_card, user_id]);
        await db.commit();    
        return { success: true, message: "Review updated!", next_review_in: interval_days };
    }catch(error){
        await db.rollback(); 
        console.error("Erro ao fazer update nos reviews", error);
        throw error; 
    }
}

async function getAnkiSentences(userID: number): Promise<Sentences_db[] | null> {
    const query = `
      SELECT 
        ac.id_card,
        ac.word_or_expression AS expression,
        ac.learning_rating,
        ac.created_at,
        ac.book_id,
        b.title,
        (
          SELECT COUNT(*) 
          FROM Anki_Cards ac2 
          WHERE ac2.book_id = ac.book_id AND ac2.user_id = ac.user_id
        ) AS cards_count_in_book
      FROM Anki_Cards ac
      JOIN Books b ON ac.book_id = b.id_book
      WHERE ac.user_id = ?
      LIMIT 10
    `;
  
    try {
      const [result] = await db.query<Sentences_db[]>(query, [userID]);
  
      if (result.length === 0) {
        return null;
      }
  
      return result;
    } catch (error) {
      console.error("Error fetching Anki sentences:", error);
      throw new Error("Database query failed");
    }
  }
  


async function addSentences(userID: number, sentence: string, bookId: number): Promise<boolean> {
    if (!validateSentence(sentence)) {
        throw new Error("formato invalido");
    }

    const connection = await db.getConnection(); // You must get a transactional connection
    try {
        await connection.beginTransaction();

        const currentDate: Date = new Date();
        const formattedDate: string = formatDateForSQL(currentDate);

        const query = `
            INSERT INTO Anki_Cards (user_id, book_id, word_or_expression, learning_rating, review_date) 
            VALUES (?, ?, ?, ?, ?)`;

        await connection.query(query, [userID, bookId, sentence, 0, formattedDate]);

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback(); // rollback on the transactional connection
        console.error("Erro adicionando frase no anki", error);
        throw error;
    } finally {
        connection.release(); // always release connection
    }
}


export { getAnkiSentences, updateCardReview, addSentences};

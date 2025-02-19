import db from '../Database'; 
import { RowDataPacket } from "mysql2/promise"; // Tipagem para resultados do MySQL


// Interface para o formato que o banco de dados retorna
interface BookDB extends RowDataPacket {
  id_Book: number;
  title_book: string;
  Author: string;
  synopse: string;
}
async function getHistoria(title: string, id: string) {
    const query = `SELECT Book_text FROM Books WHERE title = ? AND id = ?`;
    const [result]: any = await db.query(query, [title, id]);
    if (result.length === 0) {
        return null; 
    }
    return result;
} 

async function gethistoriaData() {
  const query = `SELECT id_Book, title_book, Author, synopse, level_book FROM Books`;
  const [result]: any = await db.query(query);

  if (result.length === 0) {
      return null; 
  }

  const booksArray = result.map((book: BookDB) => ({
      id: book.id_Book,
      title: book.title_book,
      description: book.synopse,
      author: book.Author,
      level: book.level_book, 
      buttonText: "Iniciar Leitura"
  }));

  return booksArray;
}

export { getHistoria, gethistoriaData };
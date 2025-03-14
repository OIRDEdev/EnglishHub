import db from '../Database'; 
import { RowDataPacket } from "mysql2/promise"; 

interface BookDB extends RowDataPacket {
  id_book: number;
  title: string;
  author: string;
  synopsis: string;
}


async function gethistoriaData() {
  const query = `SELECT id_book, title, author, synopsis, level FROM Books`;
  const [result]: any = await db.query(query);

  if (result.length === 0) {
      return null; 
  }

  const booksArray = result.map((book: BookDB) => ({
      id: book.id_book,
      title: book.title,
      description: book.synopsis,
      author: book.author,
      level: book.level, 
      buttonText: "Iniciar Leitura"
  }));

  return booksArray;
}

export { gethistoriaData };
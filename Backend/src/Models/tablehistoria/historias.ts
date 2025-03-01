import db from '../Database'; 
import { RowDataPacket } from "mysql2/promise"; 

// Interface para o formato que o banco de dados retorna
interface BookDB extends RowDataPacket {
  id_Book: number;
  title_book: string;
  Author: string;
  synopse: string;
}

async function getHistoria(id: string) {
   console.log(id);
   console.log(typeof(id));
    const query = `SELECT Book_text FROM Books WHERE id_Book = ${id}`;
    const [result]: any = await db.query(query);
    if (result.length === 0) {
        return null; 
    }

    let text: string = result[0].Book_text;
    console.log(text);
    text = text
    .replace(/\[/g, '<span class="sentence_">')
    .replace(/\]/g, '</span>')
    .replace(/\(/g, '<span class="text_in_english">')
    .replace(/\)/g, "</span>")
    .replace(/\{/g, '<span class="translate_span">')
    .replace(/\}/g, "</span>");
    console.log(text);
    return text;
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
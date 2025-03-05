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

// Substituições combinadas em um único replace com expressão regular
text = text.replace(/\[|\]|\(|\)|\{|\}/g, (match) => {
  switch (match) {
    case '[':
      return '<p class="sentence_">';
    case ']':
      return '</p>';
    case '(':
      return '<span class="text_in_english">';
    case ')':
      return '</span>';
    case '{':
      return '<span class="translate_span">';
    case '}':
      return '</span>';
    default:
      return match;
  }
});

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
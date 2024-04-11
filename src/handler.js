const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading = false,
  } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  console.log(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const lowerCaseName = name.toLowerCase();
    return h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.name.toLowerCase()
          .includes(lowerCaseName)).map((newBook) => ({
          id: newBook.id,
          name: newBook.name,
          publisher: newBook.publisher,
        })),
      },
    });
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    return h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.reading === isReading).map((newBook) => ({
          id: newBook.id,
          name: newBook.name,
          publisher: newBook.publisher,
        })),
      },
    });
  }

  if (finished !== undefined) {
    const hasFinished = finished === '1';
    return h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.finished === hasFinished).map((newBook) => ({
          id: newBook.id,
          name: newBook.name,
          publisher: newBook.publisher,
        })),
      },
    });
  }

  return h.response({
    status: 'success',
    data: {
      books: books.map((newBook) => ({
        id: newBook.id,
        name: newBook.name,
        publisher: newBook.publisher,
      })),
    },
  });
};

module.exports = { addBookHandler, getAllBookHandler };

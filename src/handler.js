const { v4: uuidv4 } = require('uuid');
const books = require('./books');

exports.addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = uuidv4();
  const insertedAt = new Date().toISOString();

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    insertedAt,
    updatedAt: insertedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter(book => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

exports.getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let data = books;

  if (name) {
    const search = name.toLowerCase();
    data = data.filter(e => e.name.toLowerCase().includes(search));
  }
  if (reading === '1' || reading === '0') {
    data = data.filter(e =>
      reading === '1' ? e.reading === true : e.reading === false
    );
  }
  if (finished === '1' || finished === '0') {
    data = data.filter(e =>
      finished === '1' ? e.finished === true : e.finished === false
    );
  }

  const response = h.response({
    status: 'success',
    data: {
      books: data.map(e => ({
        id: e.id,
        name: e.name,
        publisher: e.publisher,
      })),
    },
  });

  return response;
};

exports.getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter(b => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

exports.editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex(book => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished: pageCount === readPage,
      updatedAt: new Date().toISOString(),
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

exports.deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex(book => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

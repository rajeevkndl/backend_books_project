const config = require("../../env.json")[process.env.NODE_ENV || "local"];

const { MongoClient } = require("mongodb");

const client = new MongoClient(config.mongoUri);

const database = client.db("book_project");
const books = database.collection("books");

// add books api
exports.addBook = async (req, res) => {
  let bookData = req.body.books;
  console.log(bookData);
  try {
    const options = { ordered: true };
    const highestIdDocument = await books.findOne({}, { sort: { id: -1 } });
    let nextId = highestIdDocument ? highestIdDocument.id + 1 : 1;

    // Assigning auto-incremented ids to books
    bookData.forEach((book) => {
      book.id = nextId++;
    });
    console.log(bookData, "bookData");
    const resultBooks = await books.insertMany(bookData, options);
    return res.json({
      resultBooks,
    });
  } catch (e) {
    return res.json({
      error: `some error occured during adding books: ${e.message}`,
    });
  }
};

// get all books api
exports.getAllBook = async (req, res) => {
    let {search} = req.query
    let page = parseInt(req.query.page)|| 0
    let size = parseInt(req.query.size) || 10
    let toskip = size * page
    let filter = {}
    if (search){
        filter = {title: {'$regex': `${search}`,'$options': 'i'}}
    }

  try {
    const bookData = await books.find(filter).skip(toskip).limit(size).toArray();
    console.log(JSON.parse(JSON.stringify(bookData)));
    return res.json({
      books: bookData,
    });
  } catch (e) {
    return res.json({
      error: `some error occured during adding books: ${e.message}`,
    });
  }
};


// get book by id
exports.getBookById = async (req, res) => {
  const bookId = req.params.id;
  console.log(bookId);
  try {
    const bookData = await books.findOne({ id: parseInt(bookId) });
    console.log(bookData);
    console.log(JSON.parse(JSON.stringify(bookData)));
    return res.json({
      books: bookData,
    });
  } catch (e) {
    return res.json({
      error: `some error occured during adding books: ${e.message}`,
    });
  }
};

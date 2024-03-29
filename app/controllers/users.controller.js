const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../env.json")[process.env.NODE_ENV || "local"];

const { MongoClient } = require("mongodb");

const client = new MongoClient(config.mongoUri);

const database = client.db("book_project");
const users = database.collection("users");
const books = database.collection("books");

const usersBook = database.collection("users_book");
const { userBookStatus } = require("../utils/enums");

// add user api
exports.addUser = async (req, res) => {
  const user = JSON.parse(("req.body", req.body.user));
  console.log(user);
  try {
    const options = { ordered: true };
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const highestIdDocument = await users.findOne({}, { sort: { id: -1 } });
    let nextId = highestIdDocument ? highestIdDocument.id + 1 : 1;

    // Assigning auto-incremented ids to users
    user.id = nextId++;
    const addUser = await users.insertOne(user);
    res.json({
      userDetails: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (e) {
    return res.json({
      error: `some error occured during adding books: ${e.message}`,
    });
  }
};

// user login api
exports.userLogin = async (req, res) => {
  const user = JSON.parse(("req.body", req.body.user));
  try {
    // Finding the user by username or email
    const userDb = await users.findOne({
      $or: [
        { username: user.usernameOrEmail },
        { email: user.usernameOrEmail },
      ],
    });

    if (!userDb) {
      return res.status(404).json({ error: "User not found" });
    }

    // Comparing the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(user.password, userDb.password);

    // If passwords do not match
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generating a JWT token
    const token = generateJWTToken(userDb);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }

  // Function to generate JWT token
  function generateJWTToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const secretKey = "12345678";

    // Token expires in 1 hour
    const token = jwt.sign(payload, config.secretKey, { expiresIn: "1h" });

    return token;
  }
};

exports.bookBorrowedByUser = async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const userId = parseInt(req.params.userId);
  if (bookId && userId) {
    try {
      // add code to check if user exist
      const user = await users.findOne({ id: userId });

      if (!user) {
        return res.json({ error: `User with id ${userId} not found` });
      }
      // also book count cannot go below zero
      const updateBookDetails = await books.findOneAndUpdate(
        { id: bookId, quantity: { $gt: 0 } },
        { $inc: { quantity: -1 } }
      );
      console.log(updateBookDetails, "updateBookDetails");
      // after find and update if nothing is updated then means book isnt there add condition for that to return
      if (!updateBookDetails) {
        return res.json({ error: `Book with id ${bookId} not found` });
      }

      const addBookToUser = await usersBook.updateOne(
        { bookId: bookId, userId: userId },
        { $set: { status: userBookStatus.BORROW.description } },
        { upsert: true }
      );
      res.json({ bookAddUser: addBookToUser });
    } catch (e) {
      res.json({
        error: `some error occured during adding books to user: ${e.message}`,
      });
    }
  } else {
    res.json({
      error: `some error occured during adding books to user`,
    });
  }
};

exports.bookReturnedByUser = async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const userId = parseInt(req.params.userId);
  if (bookId && userId) {
    try {
      //code to check if user exist
      const user = await users.findOne({ id: userId });

      if (!user) {
        return res.json({ error: `User with id ${userId} not found` });
      }
      const updateBookDetails = await books.findOneAndUpdate(
        { id: bookId, quantity: { $gte: 0 } },
        { $inc: { quantity: +1 } }
      );
      // after find and update if nothing is updated then means book isnt there add condition for that to return
      if (!updateBookDetails) {
        return res.json({ error: `Book with id ${bookId} not found` });
      }
      const removeBookFromUser = await usersBook.updateOne(
        { bookId: bookId, userId: userId },
        { $set: { status: userBookStatus.RETURNED.description } }
      );
      res.json({ bookAddUser: removeBookFromUser });
    } catch (e) {
      res.json({
        error: `some error occured during adding books to user: ${e.message}`,
      });
    }
  } else {
    res.json({
      error: `some error occured during adding books to user`,
    });
  }
};

exports.userBookDetails = async (req, res) => {
  userId = parseInt(req.params.userId);
  if (userId) {
    try {
      let usersBookDetails = await usersBook
        .find({ userId: userId })
        .project({ _id: 0 })
        .toArray();
      usersBookDetails = usersBookDetails.filter(
        (book) => book.status === userBookStatus.BORROW.description
      );
      for (let book of usersBookDetails) {
        const userDetails = await users.findOne(
          { id: book.userId },
          { password: 0 }
        );
        const bookDetails = await books.findOne(
          { id: book.bookId },
          { password: 0 }
        );
        book.userDetails = userDetails;
        book.bookDetails = bookDetails;
        delete userDetails.password;
        delete userDetails._id;
        delete bookDetails._id;
        console.log(book, "bookDetails");
      }
      return res.json({ books: usersBookDetails });
    } catch (e) {
      res.json({
        error: `some error occured during getting books of usere: ${e}`,
      });
    }
  }
};

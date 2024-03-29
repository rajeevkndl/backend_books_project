const router = require("express").Router();
const usersRoute = require("./users.routes");
const { verifyToken } = require("../../middleware/authenticator.js");
const pathApi = require("../../controllers/users.controller.js");

router.use("/users", usersRoute);

router.post("/borrow/:bookId/:userId", verifyToken, pathApi.bookBorrowedByUser);
router.post("/return/:bookId/:userId", verifyToken, pathApi.bookReturnedByUser);

module.exports = router;

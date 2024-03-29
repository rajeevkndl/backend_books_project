const router = require("express").Router();
const pathApi = require("../../controllers/books.controller.js");

router.post("/", pathApi.addBook);
router.get("/", pathApi.getAllBook);
router.get("/:id", pathApi.getBookById);

module.exports = router;


const router = require("express").Router();
const pathApi = require("../../controllers/users.controller.js");
const upload = require("../../middleware/mime.validator.js");
const { verifyToken } = require("../../middleware/authenticator.js");

router.post("/", upload.array("file", 5), pathApi.addUser);
router.post("/login", upload.array("file", 5), pathApi.userLogin);
router.get("/:userId/books", verifyToken, pathApi.userBookDetails);

module.exports = router;

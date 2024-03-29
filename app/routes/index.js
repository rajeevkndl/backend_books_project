const router = require("express").Router();
const { verifyToken } = require("../middleware/authenticator");
const booksRoute = require("./books");
const usersRoute = require("./users");

router.get("/", function (req, res) {
  return res.json({ message: "api working fine" });
});

router.use("/api/", usersRoute);
router.use("/api/", verifyToken, booksRoute);

module.exports = router;

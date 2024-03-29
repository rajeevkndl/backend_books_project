const router = require("express").Router();
const bookRoutes = require("./books.routes");

router.use("/book", bookRoutes);

module.exports = router;

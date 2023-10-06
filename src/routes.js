const router = require("express").Router();

const homeController = require("./controllers/homeController");
const userController = require("./controllers/userController");
const gameController = require("./controllers/gameController");

router.use(homeController);
router.use("/users", userController);
router.use("/game", gameController);

module.exports = router;
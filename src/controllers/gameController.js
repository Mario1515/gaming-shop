const router = require('express').Router();
const gameManager = require('../managers/gameManager');
const { isAuth } = require("../middlewares/authMiddleware");
const {getErrorMessage} = require("../utils/errorHelpers");
const { platformsMap } = require("../config/config");

router.get("/", async (req, res) => {

    const game = await gameManager.getAll().lean();

    res.render("game", { game } );
});

router.get("/create", isAuth, (req, res) => {
    res.render("game/create");
});

router.post("/create", isAuth, async (req, res) => {
    const gameData = {
        ...req.body,
        owner: req.user._id,
    };

    try{
        await gameManager.create(gameData);
        res.redirect("/game");
    } catch(err) {
        res.render("game/create", { error: getErrorMessage(err) });
    }
});

router.get("/:gameId/details", async (req, res) => {
    const gameId = req.params.gameId;
    try {
    const game = await gameManager.getOne(gameId).populate("purchased.user").lean();

    const isOwner = req.user?._id == game.owner._id; // checking if this is the creater
    const isBuyer = game.purchased?.some(id => id == req.user?._id); //checking if is the buyer
    
    res.render("game/details", { game, isOwner, isBuyer});
    } catch (err){
        res.redirect("/404");
        console.log(err);
    }
});

router.get("/:gameId/buy", isAuth, async (req, res) => {
    const gameId = req.params.gameId;
    const userId = req.user._id;

    try{

    await gameManager.buy(gameId, userId)
  
    res.redirect(`/game/${gameId}/details`);

    } catch (err) {
        res.render("404");
        console.log(err);
    }

});

router.get("/:gameId/edit", isAuth, async (req, res) => {
    const game = await gameManager.getOne(req.params.gameId).lean();

    const platforms = Object.keys(platformsMap).map(key => ({
        value: key, 
        label: platformsMap[key],
        isSelected: game.platform == key,
    }));

    res.render(`game/edit`, { game, platforms });
});

router.post("/:gameId/edit", isAuth, async (req, res) => {
    const gameData = req.body;
    const gameId = req.params.gameId;
    
    
    try{

    await gameManager.edit(gameId, gameData);

    res.redirect(`/game/${gameId}/details`);

    } catch (err) {
        const game = await gameManager.getOne(gameId).populate("purchased.user").lean();
        res.render("game/edit", {error: "Unable to edit photo"}); //to check
    }

});

module.exports = router;
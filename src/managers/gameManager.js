const Game = require("../models/Game");

exports.getAll = () => Game.find().populate("owner");

exports.getOne = (gameId) => Game.findById(gameId).populate("owner");

exports.create = (gameData) => Game.create(gameData);

exports.buy = async (gameId, userId) => {

    const game = await Game.findById(gameId);

    game.purchased.push(userId);

    return game.save();

}

exports.edit = (gameId, gameData) => Game.findByIdAndUpdate(gameId, gameData);
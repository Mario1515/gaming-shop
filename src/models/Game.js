const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    image: {
        type: String,
        //validate: /^https?:\/\//,
        required: [true, "ImageUrl is required"],
    },
    price: {
        type: Number,
        //minLength: 0,
        required: [true, "Price is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        //minLength: 10,
    },
    genre: {
        type: String,
        required: [true, "Payment is required"],
    },
    platform: {
        type: String,
        required: [true, "Payment is required"],
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    purchased: [{
            type: mongoose.Types.ObjectId,
            ref: "User",
        }]
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
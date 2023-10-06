const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("../lib/jwt");
const { SECRET } = require("../config/config");


exports.login = async (email, password) => {
    // find user by username
    const user = await User.findOne({ email });

    if(!user) { 
        throw new Error("Invalid email or password") 
    };

    // check password / validate hash
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) { 
        throw new Error("Invalid user or password") 
    };

    const token = await generateToken(user);

    return token;
};

exports.register = async (userData) =>{
    const user = await User.findOne({username: userData.username});
    if(user){
        throw new Error("Username already in use");
    }

    const createdUser = await User.create(userData)
    
    const token = await generateToken(createdUser);

    return token;

} 

async function generateToken(user){

    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    }

    const token = await jwt.sign(payload, SECRET);

    return token;
}
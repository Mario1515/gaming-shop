const jwt = require("../lib/jwt");
const { SECRET, TOKEN_KEY } = require("../config/config");

// auth job is to check if user is authenticated or he is a guest. meaning user 1 or user 2 type.
exports.auth = async (req, res, next) => {
  const token = req.cookies["token"];

  if (token) {
    try {
      const decodedToken = await jwt.verify(token, SECRET);

      req.user = decodedToken;
      res.locals.user = decodedToken
      res.locals.isAuthenticated = true;

      next();
    } catch (err) {
      console.log("there is an error: " + err.message);

      res.clearCookie(TOKEN_KEY);

      res.redirect("/users/login");
    }
  } else {
    next();
  }
};

//this is a authorization middlware checking if the user is authenticated
// we use this to check.
exports.isAuth = (req, res, next) => {
    if(!req.user){
       return res.redirect("/users/login");
    }

    next();
}
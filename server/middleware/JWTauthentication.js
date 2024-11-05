const jwt = require("jsonwebtoken");

// Instantiate the JWT token validation middleware
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    req.payload = payload;

    next();
  } catch (error) {
    // We catch the error here and return a 401 status code and an error message
    // The middleware throws an error if unable to validate the token. It throws an error if:
    // 1. There is no token
    // 2. Token is invalid
    // 3. There is no headers or authorization in req (no token)
    res.status(401).json("token not provided or not valid");
  }
};

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
};

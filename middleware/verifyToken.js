const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const secretKey = process.env.PUBLIC_JWT_SECRET;

  const token = req.get("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  } else {
    jwt.verify(token, secretKey, async (err, user) => {
      if (err) {
        // console.error(err);
        return res.status(403).send("Access denied. Token is not valid!");
      } else {
        req.user = user;
        next();
      }
    });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.id === (req.params.id || req.params.userId) ||
      req.user.isAdmin
    ) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};

const jwt = require("jsonwebtoken");
const { User } = require("../models");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();

// Middleware to verify JWT and attach user data to req.user.

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 1. Handle different case keys for the ID
      const userId = decoded.id || decoded.user_id || decoded.UserID;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      // 3. Check if user exists (now 'user' is defined, so this won't crash)
      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      // 4. Attach to request
      req.user = user;
      next();
    } catch (error) {
      console.error("Middleware Error:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware to restrict access based on user role.
 
const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(403);
      throw new Error("Forbidden: User not authenticated.");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Forbidden: Role '${req.user.role}' does not have permission to access this resource.`
      );
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};

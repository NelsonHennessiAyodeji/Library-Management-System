const { verifyToken } = require("../utilities");
const { UnauthenticatedError, UnauthorizedError } = require("../error");
const path = require("path");

const authenticateUser = (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token || token == null) {
    res.sendFile(path.join(__dirname, "../public/login.html"));
    throw new UnauthenticatedError("Invalid Token");
  }

  const { userName, userEmail, userRole, userId } = verifyToken(token);
  req.user = { userName, userEmail, userRole, userId };
  next();
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      res.sendFile(path.join(__dirname, "public/login.html"));
      throw new UnauthorizedError(
        "You are not high level enough to access this route"
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};

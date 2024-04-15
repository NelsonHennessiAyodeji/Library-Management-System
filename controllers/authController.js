const User = require("../model/User");
const { attachCookiesToResponse } = require("../utilities");
const {
  BadRequestError,
  NotFoundError,
  NotAcceptableError,
  UnauthenticatedError
} = require("../error");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new BadRequestError(
      "The email that you have provided has already been registered, please use a different one"
    );
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  if (!user) {
    throw new BadRequestError("Please provide a valid username/email/password");
  }

  const userToken = {
    userName: name,
    userEmail: email,
    userId: user._id,
    userRole: role
  };
  attachCookiesToResponse(res, userToken);

  res.status(StatusCodes.CREATED).json({
    user: {
      userName: userToken.userName,
      userEmail: userToken.userEmail
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new NotAcceptableError(
      "Can't accept blank fields, provide an email and a password to login"
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(
      "The email that you have provided is not registered with us"
    );
  }

  const passwordIsCorrect = await user.comparePasswords(password);

  if (!passwordIsCorrect) {
    throw new UnauthenticatedError("Password is incorrect");
  }

  const userToken = {
    userName: user.name,
    userEmail: email,
    userId: user._id,
    userRole: user.role
  };
  attachCookiesToResponse(res, userToken);

  res.status(StatusCodes.OK).json({
    user : {
      userName: userToken.userName,
      userEmail: userToken.userEmail,
      userRole: userToken.userRole
    }
  });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(StatusCodes.OK).json("logged out");
};

module.exports = {
  register,
  login,
  logout
};

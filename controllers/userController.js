const User = require("../model/User");
const { NotFoundError, BadRequestError } = require("../error");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse } = require("../utilities");
const searchPermissions = require("../utilities/searchPermissions");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  if (!users) {
    throw new NotFoundError("Unable to find all users");
  }

  res.status(StatusCodes.OK).json(users);
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password"); //TODO if allowed, get only user role users

  if (!user) {
    throw new BadRequestError("The id that you have provided does not exists");
  }

  searchPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json(user);
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};

const updateUser = async (req, res) => {
  const { name, email } = req.body; //OPTIONAL TODO: add a password verification before saving the update
  const { userId } = req.user;

  if (!(name || email)) {
    throw new BadRequestError("Please provide a name and a password");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { ...req.body },
    { new: true, runValidators: true }
  );
  const userToken = {
    userName: name,
    userEmail: email,
    userId: user._id,
    userRole: user.role
  };

  attachCookiesToResponse(res, userToken);
  res.status(StatusCodes.OK).json(userToken);
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });

  if (!oldPassword || !newPassword) {
    throw new BadRequestError(
      "Please provide your old password and a new password"
    );
  }

  const isPasswordCorrect = await user.comparePasswords(oldPassword);

  if (!isPasswordCorrect) {
    throw new BadRequestError("Your old password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new BadRequestError("Your old and new password are matching");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json("Your password was successfully changed");
};

const addBookToList = async (req, res) => {
  console.log("YES");
  const { userId } = req.body;
  const { id: bookId } = req.params;
  const user = await User.findOne({_id: userId});

  console.log(userId, bookId, user);

  user.bookList.push(bookId);

  console.log(user.bookList);
}

const getBookList = async (req, res) => {
  const {userId} = req;
  const user = await User.findOne({_id: userId});

}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  addBookToList,
  getBookList
};

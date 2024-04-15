const Rental = require("../model/Rental");
const Book = require("../model/Book");
const { searchPermissions } = require("../utilities");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../error");
const { STATUS_CODES } = require("http");

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createRental = async (req, res) => {
  const { items: cartItems, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cartItems provided");
  }

  if (!shippingFee) {
    throw new BadRequestError("please provide and shipping fee");
  }

  // we cant use map not for each in await so we go with for of
  let rentalItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbBook = await Book.findOne({ _id: item.book });
    if (!dbBook) {
      throw new NotFoundError(`No book with id: ${item.book}`);
    }
    const { name, rentalPrice, image, _id } = dbBook;
    const singlerental = {
      amount: item.amount,
      name,
      rentalPrice,
      image,
      book: _id
    };
    //add item to rental
    rentalItems = [...rentalItems, singlerental];
    //Calculate sub total
    subtotal += item.amount * rentalPrice;
  }

  //calculate total
  const total = tax + shippingFee + subtotal;
  /*this a pseudo stripe function, as it would be too far fetched to make the real thing in a
    mock project like this, not to say i cant do it but im just not really feeling if 
    cos im not pushing up this project for reals*/

  //get client secret
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: "ngn"
  });

  const rental = await Rental.create({
    rentalItems,
    total,
    subtotal,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId
  });
  res
    .status(StatusCodes.CREATED)
    .json({ rental, clientSecret: rental.clientSecret });
};

const getAllrentals = async (req, res) => {
  const rentals = await Rental.find({});
  res.status(StatusCodes.OK).json({ count: rentals.length, rentals });
};

const getSingleRental = async (req, res) => {
  const { id: rentalId } = req.params;
  const rental = await Rental.findOne({ _id: rentalId });

  if (!rental) {
    throw new NotFoundError("This ID does not exists");
  }

  searchPermissions(req.user, rental.user);
  res.status(StatusCodes.OK).json(rental);
};

const getCurrentUserRentals = async (req, res) => {
  const userRentals = await Rental.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json(userRentals);
};

const updateRental = async (req, res) => {
  const { id: rentalId } = req.params;
  const { paymentIntentId } = req.body; //payment intent id is gotten when the payment goeds throgh
  const rental = await Rental.findOne({ _id: rentalId });

  if (!rental) {
    throw new NotFoundError("This ID does not exists");
  }

  searchPermissions(req.user, rental.user);

  rental.paymentIntentId = paymentIntentId;
  rental.status = "paid";
  await rental.save();
  res.status(StatusCodes.OK).json(rental);
};

module.exports = {
  getAllrentals,
  getSingleRental,
  getCurrentUserRentals,
  createRental,
  updateRental
};

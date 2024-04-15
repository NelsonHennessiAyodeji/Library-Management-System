const mongoose = require("mongoose");

const SingleRentalItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
    required: true
  }
});

const RentalSchema = mongoose.Schema(
  {
    shippingFee: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    rentalItems: [SingleRentalItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending"
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    clientSecret: {
      type: String,
      required: true
    },
    paymentIntentId: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rental", RentalSchema);

const mongoose = require("mongoose");

const BookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide the book's name"],
      maxlength: [30, "Name can not be more than 30 characters"]
    },
    rentalPrice: {
      type: Number,
      required: [true, "Please provide the book's rental price"],
      default: 0
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please provide the book's description"],
      maxlength: [1000, "Description can not be more than 1000 characters"]
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg"
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["Adventure", "Romance", "Comedy", "Thriller"]
    },
    featured: {
      type: Boolean,
      default: "/upload/text.txt"
    },
    texts: {
      type: String,
      trim: true,
      default: false
    },
    inventory: {
      type: Number,
      required: true,
      default: 15
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


BookSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
  }
);

module.exports = mongoose.model("Book", BookSchema);

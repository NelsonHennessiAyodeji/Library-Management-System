const fs = require('fs');
const fileUpload = require("express-fileupload");
const path = require("path");
const pdfParse = require("pdf-parse");

const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');
const Book = require("../model/Book");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../error");

const getAllBooks = async (req, res) => {
  const books = await Book.find({});

  if (!books) {
    throw new NotFoundError(
      "We could not find any Books, maybe try creating some"
    );
  }

  res.status(StatusCodes.OK).json(books);
};

const getSingleBooks = async (req, res) => {
  const { id: bookId } = req.params;
  const book = await Book.findOne({ _id: bookId });

  if (!book) {
    throw new NotFoundError(`There is no Book with id: ${bookId}`);
  }

  res.status(StatusCodes.OK).json(book);
};

const createBook = async (req, res) => {
  const book = await Book.create({
    ...req.body,
    featured: false,
    freeShipping: false,
  });

  if (!book) {
    throw new BadRequestError("Please provide necesary Book information");
  }

  res.status(StatusCodes.CREATED).send(book);
};

const updateBook = async (req, res) => {
  const { id: bookId } = req.params;
  const book = await book.findOneAndUpdate(
    { _id: bookId },
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!book) {
    throw new NotFoundError(`Could not find Book with id: ${bookId}`);
  }

  res.status(StatusCodes.OK).json(book);
};

const deleteBook = async (req, res) => {
  const { id: bookId } = req.params;
  const book = await Book.findOne({ _id: bookId });

  if (!book) {
    throw new NotFoundError(`Could not find Book with id: ${bookId}`);
  }

  await book.deleteOne({ _id: bookId });

  res.status(StatusCodes.OK).json({
    masg: "Deleted a Book",
    book: book
  });
};

const uploadBook = async (req, res) => {
  const {name, category, description, rentalPrice} = req.body;
  let txt;
  if (!name) {
    res.status(StatusCodes.BAD_REQUEST).json("Please type in a name");
  }

  if (!description) {
    res.status(StatusCodes.BAD_REQUEST).json("Please type in a description");
  }
  
  if (!rentalPrice) {
    res.status(StatusCodes.BAD_REQUEST).json("Please give an amount to the rental price");
  }

  if (!req.files || !req.files.pdfFile) {
    res.status(400).json("Please slect a PDF file");
  }

  pdfParse(req.files.pdfFile).then(result => {
    txt = result.text;
    const textContent = txt;
    // File path where the text file will be stored
    const filePath = `./upload/${req.files.pdfFile.name}.txt`;
    fs.writeFile(filePath, textContent, (err) => { 
      if(err) { 
        throw err; 
      }
      // console.log("Data has been written to file successfully."); 
    });
  }).finally(async () => {
    if (!category) {
      res.status(StatusCodes.BAD_REQUEST).json("Please type in a category for the book, eg. Adventure, Romance, Thriller, Comedy");
      return;
    }  
    const book = await Book.create({
      name: name,
      category: category,
      description: description,
      texts: txt,
      rentalPrice,
      featured: false,
      freeShipping: false,
    });
    
    if (!book) {
      throw new BadRequestError("Please provide necesary Book information");
    }
  
    res.status(StatusCodes.CREATED).send(book);  
});
}


module.exports = {
  getAllBooks,
  getSingleBooks,
  createBook,
  updateBook,
  deleteBook,
  uploadBook
};

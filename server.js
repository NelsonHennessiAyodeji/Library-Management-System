require("dotenv").config();
require("express-async-errors");

//App starters Import
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfParse = require("pdf-parse");
// const pdfReader = require('pdfreader');

const fileUpload = require("express-fileupload");
const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//Database connection Import
const db = require("./database/connectDB");

//Cookie Parser Import
const cookieParser = require("cookie-parser");

//Router Imports
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const bookRouter = require("./routers/bookRouter");
const rentalRouter = require("./routers/RentalRouter");

//Middleware Import
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const { error } = require("console");

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST']
}));


//Move the pdf to storage
// app.post('/upload',
//     fileUpload({ createParentPath: true }),
//     filesPayloadExists,
//     fileExtLimiter(['.pdf']),
//     fileSizeLimiter,
//     (req, res) => {
//       const files = req.files
//       console.log(files)

//         Object.keys(files).forEach(key => {
//             const filepath = path.join(__dirname, 'files', files[key].name)
//             files[key].mv(filepath, (err) => {
//                 if (err) return res.status(500).json({ status: "error", message: err })
//             })
//         })

//         return res.json({ status: 'success', message: Object.keys(files).toString() })
//     }
// );


// // Set up multer storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// // Set up a route for file upload
// app.post('/upload', upload.single('pdf'), async (req, res) => { console.log("Yo");
//     try {
//       console.log("HEYY");
//         const pdfPath = 'C:/Users/Khomeini NSE/Dev Projects/Web Dev/Library Management System/files/{1B14694F-55EF-4C7B-BCFF-ABE391F980FA}.png';

//         // Convert the first page of PDF to image
//         const options = {
//             density: 100,
//             saveFilename: "first_page",
//             savePath: "./upload",
//             format: "png",
//             width: 600,
//             height: 600
//         };
//         const pdf2pic = fromPath(pdfPath, options);
//         const page1Image = await pdf2pic(1);

//         // Get the file name
//         const fileName = req.file.originalname.replace(path.extname(req.file.originalname), '.png');

//         // Construct the file path where the image will be saved
//         const filePath = path.join(__dirname, 'upload', fileName);

//         // Write the image to the file system
//         fs.writeFileSync(filePath, page1Image);

//         res.status(200).send('Image saved successfully');
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// // Function to read and extract text from the PDF file
// function extractTextFromPDF(pdfPath) {
//   return new Promise((resolve, reject) => {
//       // Read the PDF file
//       const dataBuffer = fs.readFileSync(pdfPath);

//       // Initialize PDFParser
//       const pdfParser = new PDFParser();

//       // Parse PDF content
//       pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
//       pdfParser.on('pdfParser_dataReady', pdfData => {
//           const textContent = pdfData.formImage.Pages.map(page => page.Texts.map(text => Buffer.from(text.R[0].T, 'base64').toString('utf-8'))).join('\n');
//           resolve(textContent);
//       });

//       pdfParser.parseBuffer(dataBuffer);
//   });
// }


// app.post('/upload', (req, res) => {
//   const pdfPath = 'C:/Users/Khomeini NSE/Dev Projects/Web Dev/Library Management System/files/{1B14694F-55EF-4C7B-BCFF-ABE391F980FA}.png'; // Replace 'example.pdf' with the path to your PDF file
//   extractTextFromPDF(pdfPath)
//       .then(textContent => {
//           // Store the extracted text content to a text file
//           fs.writeFileSync('extractedText.txt', textContent);
//           console.log('Text content extracted and stored successfully.');
//       })
//       .catch(error => {
//           console.error('Error:', error);
//       });
//   });

// app.post('/upload', (req, res) => {
// const pdfExtract = new PDFExtract();
// const options = {firstpage}; /* see below */
// pdfExtract.extract('C:/Users/Khomeini NSE/Dev Projects/Web Dev/Library Management System/files/{1B14694F-55EF-4C7B-BCFF-ABE391F980FA}.png', options, (err, data) => {
//   if (err) return console.log(err);
//   console.log(data);
// });
// });
















// // Define a route to serve the login.html file
// app.get('/', (req, res) => {
//   // Adjust the file path to point to the login.html file location
//   res.sendFile(path.join(__dirname, 'public/login.html'));
// });

// Set up static file serving for other static assets if needed
app.use(express.static(path.join(__dirname, 'public')));// app.use(helmet());
// app.use(xss());
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// app.post("/upload", async (req, res) => {
//   const {name, category} = req.body;
//   console.log(category);
//   let txt;
//   if (!req.files && !req.files.pdfFile) {
//     res.status(400);
//     res.end();
//   }
  
//   pdfParse(req.files.pdfFile).then(result => {
//     console.log(result.text);
//     txt = result.text;
//     // res.send(result.text);
//     const textContent = txt;
//     // File path where the text file will be stored
//     const filePath = `./upload/${req.files.pdfFile.name}.txt`;
//     fs.writeFile(filePath, textContent, (err) => { 
//     if(err) { 
//     throw err; 
//     }
//     console.log("Data has been written to file successfully."); 
//     }); 
//   });
// });



//Invoking Routers
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/rentals", rentalRouter);

//Error Handler Middleware
app.use(notFound);
app.use(errorHandler);











//Port Variable
const port = process.env.PORT || 3000;

//Project Startup Logic
const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.log(error.message);
  }
};

//Invoking the start method to run the app
start();
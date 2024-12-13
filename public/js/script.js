// General Variable(s)
const baseUrl = "https://library-management-system-d2rd.onrender.combooks";

// Product Section Elements
const adventureDiv = document.getElementById("Adventure");
const romanceDiv = document.getElementById("Romance");
const thrilleDiv = document.getElementById("Thriller");
const comedyDiv = document.getElementById("Comedy");
// Product Page Elements
const popupHeader = document.getElementById("popupHeader");
const popupDescription = document.getElementById("popupDesc");
const popupText = document.getElementById("popupTexts");

// Book Page Elements
const bookTitle = document.getElementById("bookTitle");
const bookText = document.getElementById("bookText");

// Product Page Logic
async function populate() {
  const res = await fetch(baseUrl, {
    method: "GET",
  });

  const data = await res.json();
  let books = data;

  books.forEach((book) => {
    if (book.category === "Adventure") {
      adventureDiv.innerHTML += `
      <div class="gallery grid-item">
      <div id="image-holder" class="image-holder">
      <img class="openBook" src="./images/book_logo_5.png" alt="img-1" id="${book._id}">
      </a>
      <div class="desc">
      <h4>Name: <span id="name">${book.name}</span></h4>
      <h4>Price: ${book.rentalPrice}</h4>
      <h6 id="desc">Description: ${book.description}</h6>
      <span id="texts" style="display: none;" >${book.texts}</span>
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      <button class='rentBtn' id='${book._id}'>Rent</button>
      </div>
      </div>
      </div>
      `;
    } else if (book.category === "Romance") {
      romanceDiv.innerHTML += `
      <div class="gallery grid-item">
      <div id="image-holder" class="image-holder">
      <img class="openBook" src="./images/book_logo_5.png" alt="img-1" id="${book._id}">
      </a>
      <div class="desc">
      <h4>Name: <span id="name">${book.name}</span></h4>
      <h4>Price: ${book.rentalPrice}</h4>
      <h6 id="desc">Description: ${book.description}</h6>
      <span id="texts" style="display: none;" >${book.texts}</span>
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      <button class='rentBtn' id='${book._id}'>Rent</button>
      </div>
      </div>
      </div>
      `;
    } else if (book.category === "Thriller") {
      thrilleDiv.innerHTML += `
      <div class="gallery grid-item">
      <div id="image-holder" class="image-holder">
      <img class="openBook" src="./images/book_logo_5.png" alt="img-1" id="${book._id}">
      </a>
      <div class="desc">
      <h4>Name: <span id="name">${book.name}</span></h4>
      <h4>Price: ${book.rentalPrice}</h4>
      <h6 id="desc">Description: ${book.description}</h6>
      <span id="texts" style="display: none;" >${book.texts}</span>
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      <button class='rentBtn' id='${book._id}'>Rent</button>
      </div>
      </div>
      </div>
      `;
    } else if (book.category === "Comedy") {
      comedyDiv.innerHTML += `
      <div class="gallery grid-item">
      <div id="image-holder" class="image-holder">
      <img class="openBook" src="./images/book_logo_5.png" alt="img-1" id="${book._id}">
      </a>
      <div class="desc">
      <h4>Name: <span id="name">${book.name}</span></h4>
      <h4>Price: ${book.rentalPrice}</h4>
      <h6 id="desc">Description: ${book.description}</h6>
      <span id="texts" style="display: none;" >${book.texts}</span>
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      <button class='rentBtn' id='${book._id}'>Rent</button>
      </div>
      </div>
      </div>
      `;
    }
  });

  const openBookDivs = document.querySelectorAll(".openBook");
  const rentBtns = document.querySelectorAll(".rentBtn");

  openBookDivs.forEach((bookDiv) => {
    bookDiv.addEventListener("click", () => {
      localStorage.setItem("bookID", bookDiv.id);
      window.location = "book.html";
    });
  });

  rentBtns.forEach((rentBtn) => {
    rentBtn.addEventListener("click", async () => {
      localStorage.setItem("bookID", rentBtn.id);

      const res = await fetch(
        `https://library-management-system-d2rd.onrender.comusers/list/${localStorage.getItem(
          "bookID"
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: window.localStorage.getItem("userId"),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Successfully added this book to your list");
      } else {
        alert("Something Went wrong");
      }
    });
  });
}

// Book Page Logic
async function findBookDetails() {
  const res = await fetch(`${baseUrl}/${localStorage.getItem("bookID")}`, {
    method: "GET",
  });

  const book = await res.json();
  if (res.ok) {
    bookTitle.textContent = book.name;
    bookText.textContent = book.texts;
  } else {
    window.location = "products.html";
    alert(book);
  }
}

if (adventureDiv) {
  populate();
}

if (bookTitle) {
  findBookDetails();
}

// Code for Popup divs

// let popupDescriptionText
// document.addEventListener('click', (e) => {
//   if (e.target.id === 'openBook') {
//     const nearestOutterDiv = findNearestOutterDiv(e.target);
//     const name = nearestOutterDiv.querySelector('#name');
//     const p = nearestOutterDiv.querySelector('#desc');
//     const text = nearestOutterDiv.querySelector('#texts');
//     nameText = name.textContent;
//     popupDescriptionText = p.textContent;
//     textTexts = text.textContent;
//     popupHeader.textContent = nameText;
//     popupDescription.textContent = popupDescriptionText;
//     popupText.textContent = textTexts;
//   }
// })

// function findNearestOutterDiv(element) {
//   let parent = element.parentElement;
//   while (parent) {
//     if (parent.id = 'image-holder') {
//       return parent;
//     } else {
//       return null;
//     }
//   }
// }

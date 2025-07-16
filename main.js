// Do your work here...
// console.log('Hello, world!');
const books = [];
const RENDER_EVENT = "render-book"; // untuk memindahkan, menambah, menghapus book
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("bookForm").addEventListener("submit", function (event) {
    event.preventDefault();

    addBook();
  });

  document.addEventListener(RENDER_EVENT, function () {
    // console.log(books);

    const incompleteBook = document.getElementById("incompleteBookList");
    const completeBook = document.getElementById("completeBookList");

    incompleteBook.innerHTML = "";
    completeBook.innerHTML = "";

    for (const book of books) {
      const bookElement = displayBook(book);

      if (!book.isComplete) {
        incompleteBook.append(bookElement);
      } else {
        completeBook.append(bookElement);
      }
    }
  });

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  document.getElementById("searchBook").addEventListener("submit", function (event) {
    event.preventDefault();

    const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();

    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchInput));

    const incompleteBook = document.getElementById("incompleteBookList");
    const completeBook = document.getElementById("completeBookList");

    incompleteBook.innerHTML = "";
    completeBook.innerHTML = "";

    for (const book of filteredBooks) {
      const bookElement = displayBook(book);

      if (!book.isComplete) {
        incompleteBook.append(bookElement);
      } else {
        completeBook.append(bookElement);
      }
    }
  });
});

function addBook() {
  const id = new Date().getTime();
  const bookFormTitle = document.getElementById("bookFormTitle").value;
  const bookFormAuthor = document.getElementById("bookFormAuthor").value;
  const bookFormYear = document.getElementById("bookFormYear").value;
  const bookFormIsComplete = document.getElementById("bookFormIsComplete").checked;

  const bookObject = generateBookObjects(id, bookFormTitle, bookFormAuthor, bookFormYear, bookFormIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateBookObjects(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: Number(year),
    isComplete,
  };
}

function displayBook(bookObject) {
  const bookItemTitle = document.createElement("h3");
  bookItemTitle.innerText = bookObject.title;
  bookItemTitle.setAttribute("data-testid", "bookItemTitle");

  const bookItemAuthor = document.createElement("p");
  bookItemAuthor.innerText = bookObject.author;
  bookItemAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookItemYear = document.createElement("p");
  bookItemYear.innerText = bookObject.year;
  bookItemYear.setAttribute("data-testid", "bookItemYear");

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("inner");
  bookContainer.append(bookItemTitle, bookItemAuthor, bookItemYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(bookContainer);
  container.setAttribute("data-bookid", `${bookObject.id}`);
  container.setAttribute("data-testid", "bookItem");

  if (bookObject.isComplete) {
    const bookItemIsCompleteButton = document.createElement("button");
    bookItemIsCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    bookItemIsCompleteButton.innerText = "Selesai dibaca";

    bookItemIsCompleteButton.addEventListener("click", function () {
      moveToIncomplete(bookObject.id);
    });

    const bookItemDeleteButton = document.createElement("button");
    bookItemDeleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    bookItemDeleteButton.innerText = "Hapus Buku";

    bookItemDeleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    const bookItemEditButton = document.createElement("button");
    bookItemEditButton.setAttribute("data-testid", "bookItemEditButton");
    bookItemEditButton.innerText = "Edit Buku";

    bookItemEditButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    container.append(bookItemIsCompleteButton, bookItemDeleteButton, bookItemEditButton);
  } else {
    const bookItemIsCompleteButton = document.createElement("button");
    bookItemIsCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    bookItemIsCompleteButton.innerText = "Selesai dibaca";

    bookItemIsCompleteButton.addEventListener("click", function () {
      addCompletedBook(bookObject.id);
    });

    const bookItemDeleteButton = document.createElement("button");
    bookItemDeleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    bookItemDeleteButton.innerText = "Hapus Buku";

    bookItemDeleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    const bookItemEditButton = document.createElement("button");
    bookItemEditButton.setAttribute("data-testid", "bookItemEditButton");
    bookItemEditButton.innerText = "Edit Buku";

    bookItemEditButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    container.append(bookItemIsCompleteButton, bookItemDeleteButton, bookItemEditButton);
  }

  return container;
}

function addCompletedBook(bookid) {
  const bookTarget = findBook(bookid);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveToIncomplete(bookid) {
  const bookTarget = findBook(bookid);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookid) {
  for (const book of books) {
    if (book.id === bookid) {
      return book;
    }
  }
  return null;
}

function deleteBook(bookid) {
  const bookTarget = findBookIndex(bookid);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookid) {
  for (const i in books) {
    if (books[i].id === bookid) {
      return i;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung local storage");
    return false;
  }

  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// shows where your data is stored.
const apiUrl = 'http://localhost:3000/books'; 

// Function to fetch books from the server
async function displayBooks() {
    try {
        // Make a GET request to fetch all books from the API
        const response = await fetch(apiUrl); 
        
        // Parse the response as JSON, which is an array of book objects
        const books = await response.json(); 
        
        // Pass the array of books to another function to render them on the page
        renderBookCards(books); 
    } catch (error) {
        // Log any error that occurs during the fetch operation
        console.error('Error fetching books:', error); 
    }
}

// Function to render book cards and display them on the page
function renderBookCards(books) {
    // Get the DOM element where the book cards will be displayed
    const bookList = document.getElementById('book-list');
    
    bookList.innerHTML = ''; 

 
    books.forEach(book => {
        // Create a new <div> 
        const card = document.createElement('div');
        
        // Apply Bootstrap classes to format the card layout (4-column width on medium devices)
        card.className = 'col-md-4'; 

        // Set the inner HTML of the card with book details and a remove button
        card.innerHTML = `
            <div class="card mb-4"> 
                <div class="card-body"> 
                    <h5 class="card-title">${book.title}</h5> 
                    <p class="card-text">${book.author}</p> 
                    <button class="btn btn-danger" onclick="deleteBook(${book.id})">Remove</button>
                </div>
            </div>
        `;

        // append the new card to the page
        bookList.appendChild(card); 
    });
}

// adds a new book
document.getElementById('add-book-form').addEventListener('submit', async function (e) {
    // Prevent the page from automatically refreshing
    e.preventDefault(); 

    // Create a new book object using the input values from the form
    const newBook = {
        
        title: document.getElementById('title').value, // Get the title from the form input
        author: document.getElementById('author').value, // Get the author from the form input
    };

    // calculate the next available ID using incrementing automation
    try {
        const response = await fetch(apiUrl); 
        const existingBooks = await response.json();

        // Calculate the next ID by taking the highest current ID and adding 1
        const nextId = existingBooks.length > 0 ? Math.max(...existingBooks.map(book => book.id)) + 1 : 1;

        // Assign the calculated next ID to the new book object
        newBook.id = nextId; 

        // Send a POST request to the API to create a new book entry
        const postResponse = await fetch(apiUrl, {
            method: 'POST', // Use POST to create a new resource
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newBook) // add the new book
        });

        // If the POST request is successful, log a success message and refresh the book list
        if (postResponse.ok) {
            console.log('Book added successfully!');
            displayBooks(); // Refresh the book list to show the newly added book
        }
    } catch (error) {
        // Log any error that occurs during the add operation
        console.error('Error adding book:', error); 
    }

    // Clear the form inputs after submission
    document.getElementById('title').value = ''; // Clear the title input
    document.getElementById('author').value = ''; // Clear the author input
});

// Function to delete a book by its ID
async function deleteBook(id) {
    const url = `${apiUrl}/${id}`; // 'http://localhost:3000/books/6'
    try {
        const res = await fetch(url, { method: 'DELETE' });
        if (res.ok) {
            console.log("Book deleted successfully!");
            displayBooks(); // Refresh the book list
        } else {
            console.error('Error deleting book: Not Found');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}



// Initial call to display the books when the page loads
displayBooks(); // Fetch and display books when the page is first loaded




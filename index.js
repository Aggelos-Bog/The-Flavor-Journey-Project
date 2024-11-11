// Import required packages
import express from "express";
import bodyParser from "body-parser";

// Initialize Express app and set port
const app = express();
const port = 3000;

// Initialize global variables
const currentYear = new Date().getFullYear();
let isContentValid = false;      // Flag for content validation
let subject = "";               // Store blog post subject
let title = "";                // Store blog post title
let username = "";             // Store author username
let recipe = "";              // Store blog post recipe content
let errorMess = "";          // Store error messages
let posted = false;         // Flag to track if post is submitted

// Set up middleware
app.use(express.static("public"));                    // Serve static files from 'public' directory
app.use(bodyParser.urlencoded({ extended: true }));   // Parse URL-encoded bodies

// Route handler for home page
app.get("/", (req, res) => {
  res.render("index.ejs",{
    // Pass all necessary variables to the template
    subject: subject,
    title: title,
    username: username,
    recipe: recipe,
    isContentValid: isContentValid,
    currentYear: currentYear,
    posted: posted,
  });
});

app.get("/continueReading", (req, res) => {

  // Format the recipe content for multiline display
  const formattedRecipe = insertLineBreaks(recipe);

  res.render("post.ejs",{
    // Pass all necessary variables to the template
    subject: subject,
    title: title,
    username: username,
    recipe: recipe,
    isContentValid: isContentValid,
    currentYear: currentYear,
    posted: posted,
  });
});

// Route handler for about page
app.get("/about", (req, res) => {
    res.render("about.ejs",{
      currentYear: currentYear,
      posted: posted,   
    }); 
  });

// Route handler for form page
app.get("/form", (req, res) => {
  errorMess = "";    // Reset error message when form page is loaded
  res.render("form.ejs",{
    currentYear: currentYear,
    errorMess: errorMess,
    posted: posted,
  });
});

// Route handler to reset/remove form data
app.get("/formRemove", (req, res) => {
  // Reset all form variables to initial state
  subject = "";
  title = "";
  username = "";
  recipe = "";
  isContentValid = false;
  posted = false;
  res.render("index.ejs",{
    subject: subject,
    title: title,
    username: username,
    recipe: recipe,
    isContentValid: isContentValid,
    currentYear: currentYear,
    posted: posted,
  });
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
  
// Handle form submission
app.post("/submit", (req, res) => {  
  // Get form data from request body
  subject = req.body["subject"];
  title = req.body["title"];
  username = req.body["username"];
  recipe = req.body["recipe"];

  // Validate that all fields are filled
  if(subject!=="" && title!=="" && username!=="" && recipe!=="") {
    isContentValid = true;
    posted = true;
    res.render("index.ejs",{
      subject: subject,
      title: title,
      username: username,
      recipe: recipe,
      isContentValid: isContentValid,
      currentYear: currentYear,
      posted: posted,
    });
  } else {
    // Handle validation error
    errorMess = "Subject, Title, username and recipe cannot be empty!!";
    res.render("form.ejs",{
      currentYear: currentYear,
      errorMess: errorMess,
      posted: posted,
    });
  }
});


// Function to format text with <p> tags every 75 characters or on a new line
function insertLineBreaks(text, charsPerParagraph = 90) {
  // Split text by new lines first to preserve user-added new lines
  const lines = text.split('\n');
  const paragraphs = [];

  lines.forEach(line => {
    // Break each line into chunks of `charsPerParagraph` and wrap in <p>
    for (let i = 0; i < line.length; i += charsPerParagraph) {
      paragraphs.push(`<p>${line.slice(i, i + charsPerParagraph)}</p>`);
    }
  });

  return paragraphs.join(''); // Join all <p> tags without extra spaces
}






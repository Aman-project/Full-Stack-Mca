const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS as the view engine and serve static files from /public
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory sample notes store
let notes = [
  {
    id: 1,
    title: 'Express Routing Basics',
    topic: 'Backend',
    body: 'Use app.get() to render views or read data, and app.post() with urlencoded middleware to process form submissions.'
  },
  {
    id: 2,
    title: 'EJS Template Partials',
    topic: 'Views',
    body: 'Split shared headers or navigation into views/partials and include them with <%- include("partials/header") %>.'
  }
];

let nextId = 3;

// Route 1 (GET): Home page listing all notes
app.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'All Notes',
    notes
  });
});

// Route 2 (GET): Render form page to create a new note
app.get('/notes/new', (req, res) => {
  res.render('add', {
    pageTitle: 'New Note',
    error: null,
    formData: { title: '', topic: '', body: '' }
  });
});

// Route 3 (POST): Handle new note form submission
app.post('/notes', (req, res) => {
  const title = (req.body.title || '').trim();
  const topic = (req.body.topic || '').trim() || 'General';
  const body = (req.body.body || '').trim();

  if (!title || !body) {
    return res.status(400).render('add', {
      pageTitle: 'New Note',
      error: 'Both title and note content are required.',
      formData: { title, topic, body }
    });
  }

  const created = { id: nextId++, title, topic, body };
  notes.unshift(created);
  res.redirect(`/notes/${created.id}`);
});

// Route 4 (GET): View a single note by ID
app.get('/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(item => item.id === id);

  if (!note) {
    return res.status(404).render('404', {
      pageTitle: 'Note Not Found',
      message: `No note found with ID ${req.params.id}.`
    });
  }

  res.render('note', {
    pageTitle: note.title,
    note
  });
});

// Route 5 (POST): Delete a note by ID via HTML form submission
app.post('/notes/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(item => item.id !== id);
  res.redirect('/');
});

// Route 6 (GET): About page explaining the route & EJS setup
app.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About',
    totalNotes: notes.length
  });
});

// Fallback 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    message: `The path "${req.originalUrl}" does not exist.`
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
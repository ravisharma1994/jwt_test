const express = require('express');
const jwt = require('jsonwebtoken');
const images = require('./images.json');
const cors = require('cors'); // Import the cors middleware
const app = express();
const PORT = 3000;
const SECRET_KEY = 'my_secret_key';

// Middleware for parsing JSON data
app.use(express.json());

// Use the cors middleware to allow cross-origin requests from any domain
app.use(cors());

// In-memory database of documents
const documents = [
  { id: 1, title: 'Document 1' },
  { id: 2, title: 'Document 2' },
  { id: 3, title: 'Document 3' },
];

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the credentials are correct
  if (username === 'admin' && password === 'admin') {
    // Generate a JWT token with a 1 hour expiration time
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Details API with authentication middleware
app.get('/documents', authenticateToken, (req, res) => {
  res.json(images);
});

// Middleware for authenticating the JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).send('Missing token');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Invalid token');

    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

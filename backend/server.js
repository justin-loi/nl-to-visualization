const express = require('express');
const cors = require('cors');
const app = express();

// Configure CORS to explicitly allow your frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(5001, () => console.log('Server running on http://localhost:5001'));
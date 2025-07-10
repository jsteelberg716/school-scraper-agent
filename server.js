const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/fetch-school-data', async (req, res) => {
  const { username, password, school_url } = req.body;

  if (!username || !password || !school_url) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // Return fake class data
  res.json({
    success: true,
    classes: ['Mock Class 1', 'Mock Class 2', 'Mock Class 3']
  });
});

app.listen(3000, () => console.log('✅ Mock server with CORS running on port 3000'));

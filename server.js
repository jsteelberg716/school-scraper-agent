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

  // 🎯 More realistic class structure for VO
  res.json({
    success: true,
    classes: [
      {
        id: 'class-psyc101',
        name: 'Psychology 101',
        source: 'login',
        syllabus: [],
        files: [],
        assignments: [],
        color: '#A8DADC'
      },
      {
        id: 'class-math122',
        name: 'Math 122B',
        source: 'login',
        syllabus: [],
        files: [],
        assignments: [],
        color: '#F4A261'
      }
    ]
  });
});

app.listen(3000, () => console.log('✅ Mock scraper with realistic classes running on port 3000'));

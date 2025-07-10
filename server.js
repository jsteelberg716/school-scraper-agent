const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/fetch-school-data', async (req, res) => {
  const { username, password, school_url } = req.body;

  if (!username || !password || !school_url) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(school_url, { waitUntil: 'networkidle' });

    // 🔐 Replace these with your real school login selectors
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // ⏳ Wait for dashboard or redirect
    await page.waitForTimeout(3000);

    // 📥 Eventually: Scrape real class data here
    const classes = [
      {
        id: 'class-psyc101',
        name: 'Psychology 101',
        source: 'login',
        syllabus: [],
        files: [],
        assignments: [],
        color: '#A8DADC',
      },
      {
        id: 'class-math122',
        name: 'Math 122B',
        source: 'login',
        syllabus: [],
        files: [],
        assignments: [],
        color: '#F4A261',
      },
    ];

    await browser.close();

    res.json({
      success: true,
      classes,
    });
  } catch (err) {
    console.error('❌ Scraping error:', err);
    res.status(500).json({
      success: false,
      error: 'Scraping failed',
    });
  }
});

app.listen(3000, () => {
  console.log('✅ Playwright scraper running on port 3000');
});

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

    // 🌐 Fill in login form (adjust selectors as needed)
    await page.fill('#username', username);
    await page.fill('input[name="j_password"]', password);
    await page.click('button[type="submit"]');

    // ⏳ Wait for post-login page to load fully
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Buffer

    // 🕸️ Get full HTML of the page
    const raw_html = await page.content();

    await browser.close();

    res.json({
      success: true,
      raw_html,
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

// ✅ FINAL server.js with Ghost Hub forwarding integration

const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/fetch-school-data', async (req, res) => {
  const { username, password, school_url } = req.body;

  if (!username || !password || !school_url) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(school_url, { waitUntil: 'networkidle' });

    // 🧠 Login selectors for Arizona (update as needed)
    await page.fill('input[name="j_username"]', username);
    await page.fill('input[name="j_password"]', password);
    await page.click('button[type="submit"]');

    // ⏳ Let login process & redirect
    await page.waitForTimeout(5000);

    // 🧱 Grab full raw HTML
    const raw_html = await page.content();

    // 🪄 Send to Ghost Hub
    await fetch('https://your-crammer-url.com/api/ghost-hub', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: username,
        raw_html: raw_html
      })
    });

    await browser.close();

    res.json({ success: true, message: 'Scraping and forwarding complete' });
  } catch (err) {
    console.error('❌ Scraping error:', err);
    res.status(500).json({ success: false, error: 'Scraping failed' });
  }
});

app.listen(3000, () => {
  console.log('✅ Playwright scraper with Ghost Hub forwarding running on port 3000');
});

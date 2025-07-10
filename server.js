// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.json());

app.post('/api/fetch-school-data', async (req, res) => {
  const { username, password, school_url } = req.body;

  // Validate school_url
  if (
    !school_url ||
    !school_url.startsWith('https://') ||
    !school_url.includes('.') ||
    school_url.length < 10
  ) {
    return res.status(400).json({
      success: false,
      error: 'Invalid school URL. Please make sure it starts with https:// and is a real site.'
    });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome', // 🛠️ Use Render's built-in browser
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(school_url, { waitUntil: 'networkidle2' });

    // 🔒 Replace these with real selectors for your school login
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('#loginBtn');
    await page.waitForNavigation();

    // 🧠 Replace this logic with real scraping if needed
    const classes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.class-title')).map(el => el.innerText);
    });

    await browser.close();

    res.json({ success: true, classes });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log('✅ Scraper server running on port 3000'));

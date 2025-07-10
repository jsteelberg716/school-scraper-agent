const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.json());

app.post('/api/fetch-school-data', async (req, res) => {
  const { username, password, school_url } = req.body;

  if (!school_url || !school_url.startsWith('https://')) {
    return res.status(400).json({ success: false, error: 'Invalid school URL.' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(school_url, { waitUntil: 'networkidle2' });

    // Dummy logic for now
    const classes = await page.evaluate(() => {
      return ['Class A', 'Class B', 'Class C'];
    });

    await browser.close();
    res.json({ success: true, classes });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log('✅ Server running'));

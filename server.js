const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dillon2024admin';
const ARTICLES_FILE = path.join(__dirname, 'articles.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ---- API: Get articles ----
app.get('/api/articles', (req, res) => {
  try {
    const data = fs.readFileSync(ARTICLES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: 'Could not read articles' });
  }
});

// ---- API: Save articles (admin only) ----
app.post('/api/articles', (req, res) => {
  const pw = req.headers['x-admin-password'];
  if (pw !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  try {
    const articles = req.body;
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Could not save articles' });
  }
});

// ---- Catch-all: serve HTML pages ----
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dillon Price Portfolio running on port ${PORT}`);
});

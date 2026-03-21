const express = require('express');
const cors = require('cors');
const cron = require('./cron');

const app = express();
const PORT = process.env.PORT || 4400;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'cron-parser-api', version: '1.0.0',
    endpoints: [
      'GET  /api/v1/explain/:expression',
      'GET  /api/v1/validate/:expression',
      'GET  /api/v1/next/:expression',
      'POST /api/v1/generate',
      'GET  /api/v1/common',
    ],
  });
});

app.get('/api/v1/explain/:expression(*)', (req, res) => {
  try { res.json(cron.explain(req.params.expression)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/api/v1/validate/:expression(*)', (req, res) => {
  res.json(cron.validate(req.params.expression));
});

app.get('/api/v1/next/:expression(*)', (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 5, 20);
    const from = req.query.from ? new Date(req.query.from) : new Date();
    const result = cron.explain(req.params.expression);
    result.nextRuns = cron.nextRuns(req.params.expression, count, from);
    res.json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/v1/generate', (req, res) => {
  try { res.json(cron.generate(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/api/v1/common', (req, res) => {
  res.json(cron.COMMON);
});

app.listen(PORT, () => console.log(`cron-parser-api running on http://localhost:${PORT}`));

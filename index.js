import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


// מציאת הנתיב המוחלט של התיקייה הנוכחית (עבור ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// טעינת קובץ ה-.env הנמצא באותה תיקייה של index.js
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// Part 1
// ==========================================
app.get('/greet', (req, res) => {
  res.json({ msg: `hi from get endpoint ${new Date().toISOString()}` });
});

// ==========================================
// Part 2
// ==========================================
app.get('/greet/:name', (req, res) => {
  const name = req.params.name;
  console.log(`i got name: ${name}`);
  res.json({ msg: `got name: ${name}` });
});

app.get('/test', async (req, res) => {
  try {
    const testName = 'Bob';
    const response = await fetch(`http://localhost:${PORT}/greet/${testName}`);
    const data = await response.json();

    if (data && data.msg === `got name: ${testName}`) {
      return res.json({ result: 'ok' });
    } else {
      return res.json({ result: 'fail' });
    }
  } catch (error) {
    console.error('Error during fetch in /test:', error);
    return res.json({ result: 'fail' });
  }
});

// ==========================================
// Part 3: Action-Based POST Endpoint
// ==========================================
app.post('/action', async (req, res) => {
  const { action } = req.body || {};

  if (!action || (action !== 'joke' && action !== 'cat fact')) {
    return res.status(400).json({ msg: 'body is malformed' });
  }

  try {
    if (action === 'joke') {
      // קריאה ל-API חלופי ואמין במקרה ש-official-joke-api מחזיר 503
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=twopart');
      
      if (!response.ok) {
        console.error(`Joke API status error: ${response.status}`);
        return res.status(500).json({ msg: 'Joke API request failed' });
      }

      const data = await response.json();
      
      if (!data.setup || !data.delivery) {
        return res.status(500).json({ msg: 'Joke API response malformed' });
      }

      // ב-JokeAPI החלק השני נקרא delivery במקום punchline
      const fullJoke = `${data.setup} ${data.delivery}`.toUpperCase();
      return res.json({ joke: fullJoke });
    }

    if (action === 'cat fact') {
      const CAT_API_KEY = process.env.CAT_API_KEY;

      if (!CAT_API_KEY) {
        console.error('Error: CAT_API_KEY is missing from process.env');
        return res.status(500).json({ msg: 'API key is missing in environment' });
      }

      const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=11', {
        headers: {
          'x-api-key': CAT_API_KEY
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Cat API returned status ${response.status}:`, errorText);
        return res.status(500).json({ msg: 'Cat API request failed' });
      }

      const data = await response.json();
      return res.json({ length: String(data.length) });
    }
  } catch (error) {
    console.error('Error handling action:', error);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
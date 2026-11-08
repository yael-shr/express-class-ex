import express from 'express';
const app = express();

app.get('/greet', (req, res) => {
    res.send(new Date().toISOString());
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
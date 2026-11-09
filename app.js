import express from 'express';
import greetRouter from './routes/greet.js';
import usersRouter from './routes/users.js'; // ייבוא ה-Router של המשתמשים
import postsRouter from './routes/posts.js'; // ייבוא ה-Router של הפוסטים

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(greetRouter);
app.use('/users', usersRouter); // הרכבת ה-Router תחת /users
app.use('/posts', postsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import commentsRouter from './comments.js';

const router = express.Router();

// מבנה הזיכרון הכללי לפוסטים ותגובות
export const posts = [{ id: 1, title: 'Hello' }];
export const comments = { 1: [] };

// GET /posts - קבלת כל הפוסטים
router.get('/', (req, res) => {
  res.json(posts);
});

// GET /posts/:postId - קבלת פוסט לפי מזהה
router.get('/:postId', (req, res) => {
  const pid = Number(req.params.postId);
  const post = posts.find((p) => p.id === pid);

  if (!post) {
    return res.status(404).json({ msg: 'Post not found' });
  }

  res.json(post);
});

// הרכבת ה-commentsRouter תחת המסלול המקונן /:postId/comments
router.use('/:postId/comments', commentsRouter);

export default router;
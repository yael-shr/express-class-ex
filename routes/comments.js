import express from 'express';
import { posts, comments } from './posts.js';

// חובה לחבר mergeParams: true כדי לקבל גישה ל-postId מה-Router האב!
const router = express.Router({ mergeParams: true });

// Middleware: בדיקה האם הפוסט קיים לפני שממשיכים למסלולי התגובות
router.use((req, res, next) => {
  const pid = Number(req.params.postId);
  const postExists = posts.some((p) => p.id === pid);

  if (!postExists) {
    return res.status(404).json({ msg: 'Post not found' });
  }

  next();
});

// GET / - קבלת כל התגובות של פוסט מסוים
router.get('/', (req, res) => {
  const pid = Number(req.params.postId);
  res.json(comments[pid] || []);
});

// POST / - הוספת תגובה חדשה לפוסט
router.post('/', (req, res) => {
  const pid = Number(req.params.postId);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ msg: 'Text is required' });
  }

  const newComment = { id: Date.now(), text };
  comments[pid] = comments[pid] || [];
  comments[pid].push(newComment);

  res.status(201).json(newComment);
});

export default router;
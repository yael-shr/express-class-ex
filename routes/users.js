import express from 'express';

const router = express.Router();

// מפתח הזיכרון של המשתמשים
let users = [{ id: 1, name: 'Alice' }];

// 1. GET / - קבלת כל המשתמשים
router.get('/', (req, res) => {
  res.json(users);
});

// 2. POST / - הוספת משתמש חדש
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ msg: 'Name is required' });
  }

  const newUser = { id: Date.now(), name };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 3. GET /:id - קבלת משתמש לפי מזהה
router.get('/:id', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  res.json(user);
});

// 4. PUT /:id - עדכון משתמש לפי מזהה
router.put('/:id', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const { name } = req.body;
  if (name) {
    user.name = name;
  }

  res.json(user);
});

// 5. DELETE /:id - מחיקת משתמש לפי מזהה
router.delete('/:id', (req, res) => {
  const userId = Number(req.params.id);
  const initialLength = users.length;

  users = users.filter((u) => u.id !== userId);

  if (users.length === initialLength) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // 204 No Content
  res.status(204).send();
});

export default router;
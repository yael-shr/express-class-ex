import express from 'express';

const router = express.Router();

// המסלול יושב בתוך ה-Router (במיקום /)
router.get('/', (req, res) => {
  res.json({ msg: 'Hello from /greet!' });
});

export default router;
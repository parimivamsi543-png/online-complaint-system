const express = require('express');
const {
  registerUser,
  loginUser,
  getUsers,
  getAgents,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, authorize('admin'), getUsers);
router.get('/agents', protect, authorize('admin'), getAgents);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

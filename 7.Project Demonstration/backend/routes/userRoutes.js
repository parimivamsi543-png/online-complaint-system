const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  getAgents,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/agents', protect, authorize('admin'), getAgents);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

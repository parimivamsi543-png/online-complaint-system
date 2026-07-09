const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getAnalytics,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.post('/', protect, createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, authorize('admin'), updateComplaint);
router.delete('/:id', protect, authorize('admin'), deleteComplaint);

module.exports = router;

const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getDashboardStats,
  getNotifications,
  markNotificationRead,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', authorize('admin'), getDashboardStats);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

router.route('/')
  .post(createComplaint)
  .get(getComplaints);

router.route('/:id')
  .get(getComplaintById)
  .put(updateComplaint)
  .delete(authorize('admin'), deleteComplaint);

module.exports = router;

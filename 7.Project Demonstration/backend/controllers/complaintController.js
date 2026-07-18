const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async (userId, complaintId, type, message) => {
  try {
    await Notification.create({ user: userId, complaint: complaintId, type, message });
  } catch (error) {
    console.error('Notification creation failed:', error.message);
  }
};

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
      location,
      priority: priority || 'Medium',
    });

    await createNotification(
      req.user._id,
      complaint._id,
      'Complaint Created',
      `Your complaint "${title}" has been registered successfully.`
    );

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email')
      .populate('assignedAgent', 'name email');

    res.status(201).json(populatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    let filter = {};

    if (req.user.role === 'user') {
      filter.userId = req.user._id;
    } else if (req.user.role === 'agent') {
      filter.assignedAgent = req.user._id;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedAgent', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (
      req.user.role === 'user' &&
      complaint.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    if (
      req.user.role === 'agent' &&
      complaint.assignedAgent &&
      complaint.assignedAgent._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const { title, description, category, location, priority, status, assignedAgent } = req.body;

    if (req.user.role === 'user') {
      if (complaint.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this complaint' });
      }
      if (title) complaint.title = title;
      if (description) complaint.description = description;
      if (category) complaint.category = category;
      if (location) complaint.location = location;
      if (priority) complaint.priority = priority;
    }

    if (req.user.role === 'admin' || req.user.role === 'agent') {
      if (title) complaint.title = title;
      if (description) complaint.description = description;
      if (category) complaint.category = category;
      if (location) complaint.location = location;
      if (priority) complaint.priority = priority;

      if (status) {
        const oldStatus = complaint.status;
        complaint.status = status;
        if (oldStatus !== status) {
          await createNotification(
            complaint.userId,
            complaint._id,
            'Status Changed',
            `Your complaint "${complaint.title}" status changed from ${oldStatus} to ${status}.`
          );
        }
      }

      if (assignedAgent !== undefined) {
        if (assignedAgent) {
          const agent = await User.findById(assignedAgent);
          if (!agent || agent.role !== 'agent') {
            return res.status(400).json({ message: 'Invalid agent selected' });
          }
          complaint.assignedAgent = assignedAgent;
          if (complaint.status === 'Pending') {
            complaint.status = 'Assigned';
          }
          await createNotification(
            complaint.userId,
            complaint._id,
            'Agent Assigned',
            `An agent has been assigned to your complaint "${complaint.title}".`
          );
          await createNotification(
            assignedAgent,
            complaint._id,
            'Agent Assigned',
            `You have been assigned to complaint "${complaint.title}".`
          );
        } else {
          complaint.assignedAgent = null;
        }
      }

      if (status === 'Resolved') {
        await createNotification(
          complaint.userId,
          complaint._id,
          'Complaint Resolved',
          `Your complaint "${complaint.title}" has been resolved.`
        );
      }
    }

    const updatedComplaint = await complaint.save();
    const populatedComplaint = await Complaint.findById(updatedComplaint._id)
      .populate('userId', 'name email')
      .populate('assignedAgent', 'name email');

    res.json(populatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await Notification.deleteMany({ complaint: complaint._id });
    await complaint.deleteOne();

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({
      status: { $in: ['Pending', 'Assigned', 'In Progress'] },
    });
    const resolvedComplaints = await Complaint.countDocuments({
      status: { $in: ['Resolved', 'Closed'] },
    });
    const usersCount = await User.countDocuments({ role: 'user' });
    const agentsCount = await User.countDocuments({ role: 'agent' });

    const statusBreakdown = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const categoryBreakdown = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      usersCount,
      agentsCount,
      statusBreakdown,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('complaint', 'title status')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getDashboardStats,
  getNotifications,
  markNotificationRead,
};

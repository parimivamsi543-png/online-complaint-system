const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async (userId, complaintId, message) => {
  await Notification.create({ userId, complaintId, message });
};

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;

    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
      location,
      priority,
    });

    await createNotification(
      req.user._id,
      complaint._id,
      `Complaint "${title}" registered successfully.`
    );

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const filter = {};

    const { status, search } = req.query;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
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

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const { status, assignedAgent, priority } = req.body;

    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;

    if (assignedAgent !== undefined) {
      if (assignedAgent) {
        const agent = await User.findById(assignedAgent);
        if (!agent || agent.role !== 'agent') {
          return res.status(400).json({ message: 'Invalid agent' });
        }
        complaint.assignedAgent = assignedAgent;
        if (complaint.status === 'Pending') complaint.status = 'Assigned';
      } else {
        complaint.assignedAgent = null;
      }
    }

    const updated = await complaint.save();

    await createNotification(
      complaint.userId,
      complaint._id,
      `Complaint status updated to "${updated.status}".`
    );

    const populated = await Complaint.findById(updated._id)
      .populate('userId', 'name email')
      .populate('assignedAgent', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    await Notification.deleteMany({ complaintId: complaint._id });
    await complaint.deleteOne();

    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const [total, pending, resolved, usersCount] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      User.countDocuments({ role: 'user' }),
    ]);

    res.json({ total, pending, resolved, usersCount });
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
  getAnalytics,
};

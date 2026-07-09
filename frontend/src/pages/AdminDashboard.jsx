import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getComplaints,
  getAnalytics,
  getAgents,
  getUsers,
  updateComplaint,
  deleteComplaint,
  deleteUser,
} from '../services/api';
import { statusColor, priorityColor, formatDate } from '../utils/helpers';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, pending: 0, resolved: 0, usersCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('complaints');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const [complaintsRes, analyticsRes, agentsRes, usersRes] = await Promise.all([
        getComplaints(params),
        getAnalytics(),
        getAgents(),
        getUsers(),
      ]);

      setComplaints(complaintsRes.data);
      setAnalytics(analyticsRes.data);
      setAgents(agentsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateComplaint(id, { status });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssignAgent = async (id, assignedAgent) => {
    try {
      await updateComplaint(id, { assignedAgent: assignedAgent || null });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign agent');
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await deleteComplaint(id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete complaint');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const statCards = [
    { label: 'Total Complaints', value: analytics.total, color: 'bg-blue-500' },
    { label: 'Pending', value: analytics.pending, color: 'bg-yellow-500' },
    { label: 'Resolved', value: analytics.resolved, color: 'bg-green-500' },
    { label: 'Users', value: analytics.usersCount, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-3xl font-bold text-white ${card.color} inline-block px-3 py-1 rounded mt-2`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-6 border-b">
        {['complaints', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

      {activeTab === 'complaints' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">User</th>
                    <th className="text-left p-3">Priority</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Agent</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Link to={`/complaints/${c._id}`} className="text-blue-600 hover:underline">
                          {c.title}
                        </Link>
                      </td>
                      <td className="p-3">{c.userId?.name || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${priorityColor[c.priority]}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                          className={`text-xs rounded px-2 py-1 border ${statusColor[c.status]}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          value={c.assignedAgent?._id || ''}
                          onChange={(e) => handleAssignAgent(c._id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="">Unassigned</option>
                          {agents.map((a) => (
                            <option key={a._id} value={a._id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-gray-500">{formatDate(c.createdAt)}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteComplaint(c._id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

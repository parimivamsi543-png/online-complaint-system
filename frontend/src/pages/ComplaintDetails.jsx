import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getComplaintById, updateComplaint } from '../services/api';
import { statusColor, priorityColor, formatDate } from '../utils/helpers';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getComplaintById(id);
      setComplaint(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      const { data } = await updateComplaint(id, { status });
      setComplaint(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading complaint details...
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded">{error}</div>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const statuses = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <h1 className="text-2xl font-bold">{complaint.title}</h1>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColor[complaint.priority]}`}>
              {complaint.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[complaint.status]}`}>
              {complaint.status}
            </span>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium">{complaint.category}</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium">{complaint.location}</p>
          </div>
          <div>
            <p className="text-gray-500">Submitted By</p>
            <p className="font-medium">{complaint.userId?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Assigned Agent</p>
            <p className="font-medium">{complaint.assignedAgent?.name || 'Not assigned'}</p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p className="font-medium">{formatDate(complaint.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-500">Last Updated</p>
            <p className="font-medium">{formatDate(complaint.updatedAt)}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-500 text-sm mb-1">Description</p>
          <p className="text-gray-800 leading-relaxed">{complaint.description}</p>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Status Timeline</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <div
                key={s}
                className={`px-3 py-2 rounded-lg text-sm ${
                  complaint.status === s
                    ? 'bg-blue-600 text-white font-medium'
                    : statuses.indexOf(s) < statuses.indexOf(complaint.status)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          {user.role !== 'admin' && (
            <p className="text-sm text-gray-500 mt-3">
              View only — contact an admin to update complaint status.
            </p>
          )}
        </div>

        {user.role === 'admin' && (
          <div className="border-t mt-6 pt-6">
            <h3 className="font-semibold mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  disabled={updating || complaint.status === s}
                  className={`px-3 py-1 rounded text-sm border ${
                    complaint.status === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-blue-50 border-gray-300'
                  } disabled:opacity-50`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;

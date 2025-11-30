import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { updateProfile, reset } from '../../store/slices/authSlice';
import Navbar from '../../components/layout/Navbar';
import { FaUser, FaEnvelope, FaIdCard, FaBuilding, FaUserCircle, FaArrowLeft, FaUserTie, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function ManagerProfile() {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && !isEditing) {
      toast.success('Profile updated successfully!');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.department) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/manager/dashboard"
          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center space-x-6">
            <div className="bg-white p-6 rounded-full">
              <FaUserTie className="text-6xl text-indigo-600" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-indigo-100 mt-1 capitalize text-lg">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaSave />
                  <span>{isLoading ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Full Name */}
            <div className="flex items-start">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
                <FaUser className="text-indigo-600 text-xl" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-lg font-semibold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <FaEnvelope className="text-green-600 text-xl" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-lg font-semibold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                )}
              </div>
            </div>

            {/* Employee ID */}
            <div className="flex items-start">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <FaIdCard className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Manager ID
                </label>
                <p className="text-lg font-semibold text-gray-900">{user?.employeeId}</p>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-start">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                <FaBuilding className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Department
                </label>
                {isEditing ? (
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="text-lg font-semibold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Management">Management</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT</option>
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{user?.department}</p>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                <FaUserTie className="text-red-600 text-xl" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Role
                </label>
                <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Manager Info */}
          <div className="mt-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>Manager Access:</strong> You have full access to view and manage team attendance records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerProfile;

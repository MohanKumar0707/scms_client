import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Hash, 
  Shield, 
  Calendar,
  Edit2,
  Save,
  X,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [saveStatus, setSaveStatus] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const registerNo = sessionStorage.getItem('registerNo');
      const role = sessionStorage.getItem('role');

      if (!registerNo) {
        navigate('/auth');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/profile/users/${registerNo}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': role
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user data');
      }

      setUser(data.user);
      setEditedUser(data.user);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveStatus({ show: false, type: '', message: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setSaveStatus({ show: false, type: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaveStatus({ show: true, type: 'loading', message: 'Updating profile...' });

      const response = await fetch(`http://localhost:5000/api/profile/users/${user.registerNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
          phone: editedUser.phone,
          department: editedUser.department,
          semester: editedUser.semester
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update session storage with new name if changed
      if (editedUser.name !== user.name) {
        sessionStorage.setItem('name', editedUser.name);
      }

      setUser(editedUser);
      setIsEditing(false);
      setSaveStatus({ 
        show: true, 
        type: 'success', 
        message: 'Profile updated successfully!' 
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ show: false, type: '', message: '' });
      }, 3000);

    } catch (err) {
      setSaveStatus({ 
        show: true, 
        type: 'error', 
        message: err.message || 'Failed to update profile' 
      });
      console.error('Error updating user:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'staff':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Edit2 size={18} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Save Status Message */}
        {saveStatus.show && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            saveStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            saveStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {saveStatus.type === 'success' ? <CheckCircle size={20} /> :
             saveStatus.type === 'error' ? <AlertCircle size={20} /> :
             <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />}
            <span className="font-medium">{saveStatus.message}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Photo with Gradient */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          
          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <span className="text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full border ${getRoleBadgeColor(user.role)} text-xs font-bold capitalize`}>
                  {user.role}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name || ''}
                    onChange={handleChange}
                    className="text-3xl font-bold text-center text-gray-900 border-b-2 border-indigo-200 focus:border-indigo-600 outline-none px-4 py-2 w-full max-w-md mx-auto"
                    placeholder="Full Name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                )}
                <p className="text-gray-500 mt-1">{user.email}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Register Number */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Hash className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Register Number</p>
                      <p className="font-semibold text-gray-900">{user.registerNo}</p>
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <BookOpen className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Department</p>
                      {isEditing ? (
                        <select
                          name="department"
                          value={editedUser.department || ''}
                          onChange={handleChange}
                          className="font-semibold text-gray-900 bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none py-1"
                        >
                          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Business Administration">Business Administration</option>
                        </select>
                      ) : (
                        <p className="font-semibold text-gray-900">{user.department}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Mail className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedUser.email || ''}
                          onChange={handleChange}
                          className="font-semibold text-gray-900 bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none py-1 w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">{user.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Phone className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editedUser.phone || ''}
                          onChange={handleChange}
                          className="font-semibold text-gray-900 bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none py-1 w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Semester (if applicable) */}
                {user.role === 'student' && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Calendar className="text-indigo-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Semester</p>
                        {isEditing ? (
                          <select
                            name="semester"
                            value={editedUser.semester || ''}
                            onChange={handleChange}
                            className="font-semibold text-gray-900 bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none py-1"
                          >
                            <option value="">Select Semester</option>
                            {[1,2,3,4,5,6,7,8].map(sem => (
                              <option key={sem} value={`Semester ${sem}`}>Semester {sem}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="font-semibold text-gray-900">{user.semester || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Member Since */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Calendar className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Member Since</p>
                      <p className="font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Mode Actions */}
              {isEditing && (
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
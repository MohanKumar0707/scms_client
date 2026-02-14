import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export default function RaiseComplaint() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    department: '',
    priority: 'Medium'
  });

  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Fetch categories and departments on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter categories when department changes
  useEffect(() => {
    if (formData.department) {
      const filtered = categories.filter(cat => cat.department._id === formData.department);
      setFilteredCategories(filtered);
      // Reset category selection if it's not in the filtered list
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    } else {
      setFilteredCategories([]);
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    }
  }, [formData.department, categories]);

  const fetchData = async () => {
    try {
      const [categoriesRes, departmentsRes] = await Promise.all([
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/departments`)
      ]);
      
      setCategories(categoriesRes.data);
      setDepartments(departmentsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage('Error loading form data');
      setMessageType('error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setMessage('Title and description are required');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Get student ID from localStorage (set during login)
      const studentId = sessionStorage.getItem('registerNo');
      
      if (!studentId) {
        setMessage('Please login first');
        setMessageType('error');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/complaints`, {
        studentId: studentId,
        title: formData.title,
        description: formData.description,
        category: formData.category || undefined,
        department: formData.department || undefined,
        priority: formData.priority
      });

      setMessage('Complaint submitted successfully!');
      setMessageType('success');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        department: '',
        priority: 'Medium'
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setMessage(err.response?.data?.message || 'Error submitting complaint');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raise a Complaint</h1>
        <p className="text-gray-600 mb-8">Please provide details about your complaint</p>

        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-800' 
              : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief title of your complaint"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about your complaint"
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select a department</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
              {formData.department && <span className="text-gray-500 text-sm"> (filtered by department)</span>}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={!formData.department}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.department ? 'Select a department first' : 'Select a category'}
              </option>
              {filteredCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
            <button
              type="reset"
              onClick={() => setFormData({
                title: '',
                description: '',
                category: '',
                department: '',
                priority: 'Medium'
              })}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-400 transition duration-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
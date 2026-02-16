import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle2, Send, Trash2, FileText, Tag, Building2, AlertTriangle, ChevronRight } from 'lucide-react';

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
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.department) {
      const filtered = categories.filter(cat => cat.department._id === formData.department);
      setFilteredCategories(filtered);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setFilteredCategories([]);
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.department, categories]);

  const fetchData = async () => {
    try {
      const [categoriesRes, departmentsRes] = await Promise.all([
        axios.get(`${API_URL}/categories/fetchcategories`),
        axios.get(`${API_URL}/categories/fetchDepartments/categories`)
      ]);
      setCategories(categoriesRes.data);
      setDepartments(departmentsRes.data);
    } catch (err) {
      setMessage({ text: 'Error loading form data', type: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setMessage({ text: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const studentId = sessionStorage.getItem('registerNo');
      if (!studentId) {
        setMessage({ text: 'Please login first', type: 'error' });
        setLoading(false);
        return;
      }

      await axios.post(`${API_URL}/complaints`, {
        studentId,
        ...formData,
        category: formData.category || undefined,
        department: formData.department || undefined,
      });

      setMessage({ text: 'Complaint submitted successfully!', type: 'success' });
      setFormData({ title: '', description: '', category: '', department: '', priority: 'Medium' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Submission failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    Low: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Medium: 'bg-blue-50 text-blue-600 border-blue-100',
    High: 'bg-orange-50 text-orange-600 border-orange-100',
    Emergency: 'bg-red-50 text-red-600 border-red-100'
  };

  const activePriorityColors = {
    Low: 'bg-emerald-600 text-white border-emerald-600',
    Medium: 'bg-blue-600 text-white border-blue-600',
    High: 'bg-orange-600 text-white border-orange-600',
    Emergency: 'bg-red-600 text-white border-red-600'
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-[120px]" />

      <div className="relative max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-100 rounded-full">
            Support Center
          </span>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">help you?</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-slate-500 leading-relaxed">
            Submit your concerns and our team will get back to you as soon as possible.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/40">
          <div className="p-8 md:p-12">
            
            {/* Success/Error Alert */}
            {message.text && (
              <div className={`flex items-center p-5 mb-8 rounded-2xl animate-bounce-short border ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-500" /> : <AlertCircle className="w-6 h-6 mr-3 text-rose-500" />}
                <span className="font-semibold">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Section */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-slate-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  What's the main issue?
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Summarize your complaint"
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-sm text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center text-sm font-bold text-slate-700 mb-3">
                    <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                    Assign Department
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer text-slate-700"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-slate-700 mb-3">
                    <Tag className="w-4 h-4 mr-2 text-blue-500" />
                    Specific Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={!formData.department}
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none disabled:bg-slate-50 disabled:cursor-not-allowed appearance-none cursor-pointer text-slate-700"
                    >
                      <option value="">{!formData.department ? 'Choose Dept First' : 'Select Category'}</option>
                      {filteredCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Priority Section */}
              <div>
                <label className="flex items-center text-sm font-bold text-slate-700 mb-4">
                  <AlertTriangle className="w-4 h-4 mr-2 text-blue-500" />
                  Urgency Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['Low', 'Medium', 'High', 'Emergency'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, priority: level }))}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${
                        formData.priority === level 
                        ? activePriorityColors[level] + ' shadow-md scale-105' 
                        : priorityColors[level] + ' hover:border-slate-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Section */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-slate-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Detailed Explanation
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us more about the issue..."
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none text-slate-800"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] disabled:from-slate-400 disabled:to-slate-400 transition-all shadow-xl shadow-blue-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Report
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ title: '', description: '', category: '', department: '', priority: 'Medium' })}
                  className="flex-1 flex items-center justify-center bg-slate-100 text-slate-600 py-4 px-8 rounded-2xl font-bold hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Improved Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 flex items-center justify-center gap-2">
            Locked & Secure <span className="w-1 h-1 bg-slate-300 rounded-full" /> 
            <a href="mailto:support@university.edu" className="font-bold text-blue-600 hover:underline">support@university.edu</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
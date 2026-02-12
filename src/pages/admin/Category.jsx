import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Category() {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ name: '', departmentId: '', priority: 'Medium' });

    // Fetch departments on load
    useEffect(() => {
        axios.get('http://localhost:5000/api/departments/categories')
            .then(res => setDepartments(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        console.log("Submitting form with data:", formData);
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/categories', formData);
            alert("Category Created!");
            console.log(res.data);
        } catch (err) {
            alert("Error creating category");
        }
    };

    return (
        <div>
            <h2>Create Category</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Category Name" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />

                <select onChange={(e) => setFormData({...formData, departmentId: e.target.value})}>
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                </select>

                <select onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                </select>

                <button type="submit">Save Category</button>
            </form>
        </div>
    );
}

export default Category;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Department() {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ name: '', code: '', description: '' });
    const [loading, setLoading] = useState(true);

    // 1. Fetch Departments from Backend
    const fetchDepartments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/departments');
            setDepartments(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // 2. Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Submit New Department
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/departments', formData);
            setFormData({ name: '', code: '', description: '' }); // Reset form
            fetchDepartments(); // Refresh list
            alert("Department added successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Error adding department");
        }
    };

    // 4. Delete Department
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await axios.delete(`http://localhost:5000/api/departments/${id}`);
                fetchDepartments();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Department Management</h2>

            {/* Form Section */}
            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
                <h3>Add New Department</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Dept Name" value={formData.name} onChange={handleChange} required />
                    <input type="text" name="code" placeholder="Dept Code" value={formData.code} onChange={handleChange} required />
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
                    <button type="submit" style={{ marginLeft: '10px', background: 'green', color: 'white' }}>Add</button>
                </form>
            </div>

            {/* Display Table */}
            <h3>Department List</h3>
            {loading ? <p>Loading...</p> : (
                <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f4f4f4' }}>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept._id}>
                                <td>{dept.code}</td>
                                <td>{dept.name}</td>
                                <td>{dept.description}</td>
                                <td>
                                    <button onClick={() => handleDelete(dept._id)} style={{ color: 'red' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Department;
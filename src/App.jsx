import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Common Routes
import Layout from "./layout/Layout";
import Login from "./pages/common/Login";
import Dashboard from "./pages/common/Dashboard";

// Admin Routes
import UserManage from "./pages/admin/UserManage";
import Department from "./pages/admin/Department";
import Category from "./pages/admin/Category";
import GrievanceInbox from "./pages/admin/GrievanceInbox";
import AssignComplaints from "./pages/admin/AssignComplaints";

// Student Routes
import RaiseComplaint from "./pages/student/RaiseComplaint";
import MyComplaints from "./pages/student/MyComplaints";

// Staff Routes
import AssignedComplaints from "./pages/staff/AssignedComplaint";

function App() {

    return (
        <Router>
            <Routes>

                {/* Common Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/layout/*" element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Admin Routes */}
                    <Route path="userManagement" element={<UserManage />} />
                    <Route path="departments" element={<Department />} />
                    <Route path="categories" element={<Category />} />
                    <Route path="grievance-inbox" element={<GrievanceInbox />} />
                    <Route path="assign-complaints" element={<AssignComplaints />} />

                    {/* Student Routes */}
                    <Route path="raise-complaint" element={<RaiseComplaint />} />
                    <Route path="my-complaints" element={<MyComplaints />} />

                    {/* Staff Routes */}
                    <Route path="assigned" element={<AssignedComplaints />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

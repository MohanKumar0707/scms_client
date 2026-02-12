import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Login from './pages/common/Login';
import UserManage from './pages/admin/UserManage';
import Dashboard from './pages/common/Dashboard';
import Department from './pages/admin/Department';

function App() {

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/layout/*" element={<Layout />}>
					{/* Common Routes */}
					<Route path='dashboard' element={<Dashboard />} />

					{/* Admin Routes */}
					<Route path='userManagement' element={<UserManage />} />
					<Route path='departments' element={<Department />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
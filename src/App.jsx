import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import UserManage from './pages/UserManage';
import Complaint from './pages/Complaint';
import Track from './pages/Track';
import Dashboard from './pages/Dashboard';

function App() {

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/layout/*" element={<Layout />}>
					<Route path='userManagement' element={<UserManage />} />
					<Route path='complaint' element={<Complaint />} />
					<Route path='track' element={<Track />} />
					<Route path='dashboard' element={<Dashboard />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
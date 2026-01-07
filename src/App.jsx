import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout'; // Correct path from src to src/pages
import Login from './pages/Login';

// Temporary components for testing
const Dashboard = () => <div className="p-4 text-2xl font-bold">Dashboard View</div>;
const Register = () => <div className="p-4 text-2xl font-bold">New Complaint Form</div>;
const Tracking = () => <div className="p-4 text-2xl font-bold">Tracking Table</div>;

function App() {

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/layout/*" element={<Layout />}>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="register" element={<Register />} />
					<Route path="tracking" element={<Tracking />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
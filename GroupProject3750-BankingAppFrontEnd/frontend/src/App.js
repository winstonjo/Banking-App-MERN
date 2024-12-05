import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Create from './components/create';
import Login from './components/login';
import Logout from './components/logout';
import AccountsInfo from './components/accountSummary';
import BankingSummary from './components/bankingSummary';
import EmployeeSummary from './components/employeeSummary';
import AdminSummary from './components/adminSummary';
import "./index.css"

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/record/auth-check', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setAuthState({ isAuthenticated: true, role: data.role });
      })
      .catch(() => {
        setAuthState({ isAuthenticated: false, role: null });
      })
      .finally(() => setLoading(false));
  }, []);

  const renderProtectedRoute = (Component, requiredrole) => {
    if (loading) return <div>Loading...</div>;

    if (authState.isAuthenticated && (!requiredrole || requiredrole.includes(authState.role))) {
      return <Component />;
    }
    return <Navigate to="/" />;
  };
//todo: Add styling - Winston
//Still needing styling:
//accountSummary
//bankingSummary
//employeeSummary
//adminSummary
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={renderProtectedRoute(Create, ['admin', 'employee'])} />
        <Route path="/logout" element={renderProtectedRoute(Logout)} />
        <Route path="/accountSummary" element={renderProtectedRoute(AccountsInfo)} />
        <Route path="/bankingSummary" element={renderProtectedRoute(BankingSummary)} />
        <Route path="/employeeSummary" element={renderProtectedRoute(EmployeeSummary, ['admin', 'employee'])} /> 
        <Route path="/adminSummary" element={renderProtectedRoute(AdminSummary, ['admin'])} /> 
      </Routes>
    </div>
  );
};

export default App;